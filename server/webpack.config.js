const path = require('path');
const glob = require('glob');

module.exports = {
  entry: glob.sync('./src/*.js').reduce((acc, path) => {
    const entry = path.replace('/index.js', '');
    acc[entry] = path;
    return acc;
  }, {}),

  output: {
    path: path.resolve(__dirname),
    filename: './src/build/[name]',
    libraryTarget: 'commonjs',
  },
  target: 'node',
  mode: 'production',
};
