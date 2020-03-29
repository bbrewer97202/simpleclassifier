const AWS = require('aws-sdk');
const util = require('./util.js');
const db = new AWS.DynamoDB.DocumentClient();

/**
 * lambda http event handler
 * return all database entries
 * @param {Object} event
 */
exports.handler = async () => {
  try {
    const results = await db.scan({ TableName: process.env.TABLE_NAME }).promise();
    const items = results.Items ? Object.keys(results.Items).map(key => results.Items[key]) : [];
    return util.respondSuccess(items);
  } catch (error) {
    console.log('getAll error', error);
    return util.respondFailure();
  }
};
