const AWS = require('aws-sdk');
const util = require('./util.js');
const db = new AWS.DynamoDB.DocumentClient();

exports.handler = async () => {
  try {
    // const query = {
    //   KeyConditionExpression: 'projectId = :projectId',
    //   ExpressionAttributeValues: {
    //     ':projectId': '1',
    //   },
    //   ProjectionExpression: 'id, label, utterances',
    // };
    // console.log('query', query);
    // const results = await db.query({ TableName: process.env.TABLE_NAME, query }).promise();
    const results = await db.scan({ TableName: process.env.TABLE_NAME }).promise();
    const items = results.Items ? Object.keys(results.Items).map(key => results.Items[key]) : [];
    return util.respondSuccess(items);
  } catch (error) {
    console.log('getAll error', error);
    return util.respondFailure();
  }
};
