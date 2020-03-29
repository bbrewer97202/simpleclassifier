const AWS = require('aws-sdk');
const WinkNBClassifier = require('wink-naive-bayes-text-classifier');
const nlp = require('wink-nlp-utils');
const util = require('./util.js');

/**
 * classifier wrapper around Wink Naive Bayes classifier
 */
class Classifier {
  constructor() {
    this.nbc = WinkNBClassifier();
    this.nbc.definePrepTasks([nlp.string.tokenize0, nlp.tokens.removeWords, nlp.tokens.stem]);
    this.nbc.defineConfig({ considerOnlyPresence: true, smoothingFactor: 0.5 });
  }

  train(trainingData = []) {
    this.nbc.reset();
    for (let line of trainingData) {
      this.nbc.learn(line.utterance, line.label);
    }
    this.nbc.consolidate();
  }

  predict(utterance) {
    return this.nbc.predict(utterance);
  }
}

/**
 * load training data from db
 * @returns {Array} list of training items or empty list
 */
const getTrainingData = async () => {
  try {
    const db = new AWS.DynamoDB.DocumentClient();
    const results = await db.scan({ TableName: process.env.TABLE_NAME }).promise();
    const items = results.Items ? Object.keys(results.Items).map(key => results.Items[key]) : [];
    const training = items.reduce((list, item) => {
      const { label, utterances = [] } = item;
      utterances.forEach(utterance => {
        list.push({ label, utterance });
      });
      return list;
    }, []);
    return training;
  } catch (e) {
    console.log('getTrainingData error', e);
    return [];
  }
};

/**
 * lambda http event handler
 * @param {Object} event
 */
const handler = async event => {
  // require an utterance string on query
  if (!event.queryStringParameters || !event.queryStringParameters.utterance) return util.respondFailure();
  const utterance = event.queryStringParameters.utterance;
  if (!utterance || utterance.length > 100) return util.respondFailure();

  // generate classifier with stored training data
  const trainingData = await getTrainingData();
  const classifier = new Classifier();
  classifier.train(trainingData);

  // predict the result of the utterance
  const result = classifier.predict(utterance);

  try {
    return util.respondSuccess({
      utterance,
      result,
    });
  } catch (error) {
    console.log('classify error', error);
    return util.respondFailure({});
  }
};

module.exports = {
  classifier: Classifier,
  handler,
  getTrainingData,
};
