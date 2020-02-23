const AWS = require('aws-sdk');
const util = require('./util.js');
const db = new AWS.DynamoDB.DocumentClient();

exports.handler = async event => {
  const id = event.pathParameters.id;
  if (!id) return { statusCode: 400 };

  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      [process.env.PRIMARY_KEY]: id,
    },
  };

  try {
    await db.delete(params).promise();
    return util.respondSuccess({});
  } catch (error) {
    console.log('delete error', error);
    return util.respondFailure({});
  }
};
