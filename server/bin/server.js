#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { SimpleClassifierStack } = require('../lib/server-stack');

// const env = { region: 'us-west-2' };

const app = new cdk.App();
const env = {
  account: app.node.tryGetContext('account'),
  region: app.node.tryGetContext('region'),
};

new SimpleClassifierStack(app, 'SimpleClassifierStack', { env });
