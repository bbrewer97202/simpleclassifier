const AWS = require('aws-sdk');
const uuidv4 = require('uuid/v4');
const db = new AWS.DynamoDB.DocumentClient();

exports.handler = async event => {
  if (!event.body) return { statusCode: 400 };

  //TODO: validation
  const item = typeof event.body == 'object' ? event.body : JSON.parse(event.body);
  item[process.env.PRIMARY_KEY] = uuidv4();

  const params = {
    TableName: process.env.TABLE_NAME,
    Item: item,
  };
  console.log('create', params);

  try {
    await db.put(params).promise();
    return { statusCode: 201 };
  } catch (error) {
    console.log('create error', error);
    return { statusCode: 500 };
  }
};
