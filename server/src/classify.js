const AWS = require('aws-sdk');
const WinkNBClassifier = require('wink-naive-bayes-text-classifier');
const nlp = require('wink-nlp-utils');
const util = require('./util.js');

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
      // console.log(`learn (${line.label}): ${line.utterance}`);
    }
    this.nbc.consolidate();
  }

  predict(utterance) {
    return this.nbc.predict(utterance);
  }
}

const getTrainingData = async () => {
  try {
    const db = new AWS.DynamoDB.DocumentClient();
    const results = await db.scan({ TableName: process.env.TABLE_NAME }).promise();
    const items = results.Items ? Object.keys(results.Items).map(key => results.Items[key]) : [];
    console.log('getTrainingData: ', items);
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

const handler = async event => {
  if (!event.queryStringParameters || !event.queryStringParameters.utterance) return { statusCode: 400 };

  const trainingData = await getTrainingData();
  console.log('trainingData: ', JSON.stringify(trainingData, null, 2));

  //TODO: validate utterance
  const utterance = event.queryStringParameters.utterance;
  const classifier = new Classifier();
  classifier.train(trainingData);

  console.log('utterance', utterance);

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
