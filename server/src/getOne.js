const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();

//TODO: this is wrong, delete this

exports.handler = async () => {
  console.log('table name', process.env.TABLE_NAME);

  try {
    const response = await db.scan({ TableName: process.env.TABLE_NAME }).promise();
    return { statusCode: 200, body: JSON.stringify(response.Items) };
  } catch (dbError) {
    return { statusCode: 500, body: JSON.stringify(dbError) };
  }
};
