const AWS = require('aws-sdk');
const util = require('./util.js');
const db = new AWS.DynamoDB.DocumentClient();

exports.handler = async event => {
  if (!event.body) return { statusCode: 400 };

  const item = typeof event.body == 'object' ? event.body : JSON.parse(event.body);
  const id = event.pathParameters.id;
  const { id: labelId, label, utterances = [] } = item;

  if (!id || !(labelId || label) || id !== labelId) return { statusCode: 400 };

  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      [process.env.PRIMARY_KEY]: id,
    },
    UpdateExpression: `set label = :label, utterances = :utterances`,
    ExpressionAttributeValues: {
      ':label': label,
      ':utterances': utterances,
    },
    ReturnValues: 'UPDATED_NEW',
  };

  try {
    await db.update(params).promise();
    return util.respondSuccess({
      labelId,
      label,
      utterances,
    });
  } catch (error) {
    console.log('update error', error);
    return { statusCode: 500 };
  }
};
