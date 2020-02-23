const { expect, matchTemplate, MatchStyle } = require('@aws-cdk/assert');
const cdk = require('@aws-cdk/core');
const Server = require('../lib/server-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new Server.ServerStack(app, 'MyTestStack');
    // THEN
    expect(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});