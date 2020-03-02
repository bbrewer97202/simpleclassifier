const cdk = require('@aws-cdk/core');
const dynamodb = require('@aws-cdk/aws-dynamodb');
const lambda = require('@aws-cdk/aws-lambda');
const apigateway = require('@aws-cdk/aws-apigateway');

const DYNAMO_TABLE_NAME = 'ClassifierDefinitions';
const DYNAMO_PRIMARY_KEY = 'id';

class SimpleClassifierStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const dynamoTable = new dynamodb.Table(this, 'SimpleClassifierDefinitionsTable', {
      partitionKey: {
        name: DYNAMO_PRIMARY_KEY,
        type: dynamodb.AttributeType.STRING,
      },
      tableName: DYNAMO_TABLE_NAME,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      // removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const baseLambdaOptions = {
      runtime: lambda.Runtime.NODEJS_12_X,
      // code: lambda.Code.asset('src/build'),
      code: new lambda.AssetCode('src'),
      environment: {
        TABLE_NAME: DYNAMO_TABLE_NAME,
        PRIMARY_KEY: DYNAMO_PRIMARY_KEY,
      },
    };

    const lambdaGetAll = new lambda.Function(this, 'GetAll', {
      ...baseLambdaOptions,
      handler: 'getAll.handler',
    });

    const lambdaCreateOne = new lambda.Function(this, 'CreateOne', {
      ...baseLambdaOptions,
      handler: 'createOne.handler',
    });

    const lambdaUpdateOne = new lambda.Function(this, 'UpdateOne', {
      ...baseLambdaOptions,
      handler: 'updateOne.handler',
    });

    const lambdaDeleteOne = new lambda.Function(this, 'DeleteOne', {
      ...baseLambdaOptions,
      handler: 'deleteOne.handler',
    });

    const lambdaClassify = new lambda.Function(this, 'Classify', {
      ...baseLambdaOptions,
      handler: 'classify.handler',
    });

    dynamoTable.grantReadWriteData(lambdaGetAll);
    dynamoTable.grantReadWriteData(lambdaUpdateOne);
    dynamoTable.grantReadWriteData(lambdaCreateOne);
    dynamoTable.grantReadWriteData(lambdaDeleteOne);
    dynamoTable.grantReadWriteData(lambdaClassify);

    const api = new apigateway.RestApi(this, 'SimpleClassifierAPI', {
      restApiName: 'SimpleClassifier API',
    });

    const labels = api.root.addResource('labels');
    const getAllIntegration = new apigateway.LambdaIntegration(lambdaGetAll);
    labels.addMethod('GET', getAllIntegration);
    const createOneIntegration = new apigateway.LambdaIntegration(lambdaCreateOne);
    labels.addMethod('POST', createOneIntegration);

    const label = labels.addResource('{id}');
    const deleteOneIntegration = new apigateway.LambdaIntegration(lambdaDeleteOne);
    label.addMethod('DELETE', deleteOneIntegration);
    const updateOneIntegration = new apigateway.LambdaIntegration(lambdaUpdateOne);
    label.addMethod('PUT', updateOneIntegration);

    const classify = api.root.addResource('classify');
    const classifyIntegration = new apigateway.LambdaIntegration(lambdaClassify);
    classify.addMethod('GET', classifyIntegration);

    addCorsOptions(api.root);
    addCorsOptions(labels);
    addCorsOptions(label);
    addCorsOptions(classify);
  }
}

//https://github.com/aws/aws-cdk/issues/906
function addCorsOptions(apiResource) {
  apiResource.addMethod(
    'OPTIONS',
    new apigateway.MockIntegration({
      integrationResponses: [
        {
          statusCode: '200',
          responseParameters: {
            'method.response.header.Access-Control-Allow-Headers':
              "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Credentials': "'false'",
            'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,PATCH,DELETE'",
          },
        },
      ],
      passthroughBehavior: apigateway.PassthroughBehavior.NEVER,
      requestTemplates: {
        'application/json': '{"statusCode": 200}',
      },
    }),
    {
      methodResponses: [
        {
          statusCode: '200',
          responseParameters: {
            'method.response.header.Access-Control-Allow-Headers': true,
            'method.response.header.Access-Control-Allow-Methods': true,
            'method.response.header.Access-Control-Allow-Credentials': true,
            'method.response.header.Access-Control-Allow-Origin': true,
          },
        },
      ],
    }
  );
}

module.exports = { SimpleClassifierStack };
