
const path = require('path');
const { rules } = require('@gpp/webpack');

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: path.join(__dirname, '..', 'src', 'index.ts'),
  module: {
    rules,
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
  },
};
