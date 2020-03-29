const AWS = require('aws-sdk');
const uuidv4 = require('uuid/v4');
const util = require('./util.js');
const db = new AWS.DynamoDB.DocumentClient();

/**
 * validate request body for valid
 * @param {Object} body request body
 * @returns {Object|null} validated payload or null
 */
const getValidatedItem = body => {
  if (!body) return null;
  const item = typeof body === 'object' ? body : JSON.parse(body);
  const { label, utterances } = item;
  if (!label || typeof label !== 'string') return null;
  if (!utterances || typeof utterances !== 'object') return null;

  return item;
};

/**
 * lambda http event handler
 * create an a database entry from the passed content
 * @param {Object} event
 */
const handler = async event => {
  const item = getValidatedItem(event.body);
  if (!item) {
    return util.respondFailure();
  }

  // assign all new items auto-generated id
  item[process.env.PRIMARY_KEY] = uuidv4();

  const params = {
    TableName: process.env.TABLE_NAME,
    Item: item,
  };

  try {
    await db.put(params).promise();
    return util.respondSuccess({
      ...item,
    });
  } catch (error) {
    console.log('create error', error);
    return util.respondFailure();
  }
};

module.exports = {
  handler,
};
