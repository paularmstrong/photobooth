const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports.rules = [
  {
    test: /\.(svg)$/,
    use: ['@svgr/webpack'],
  },
  {
    test: /\.(png|jpg|jpeg|gif|mp3|wav|ttf)$/i,
    type: 'asset/resource',
  },
  // Add support for native node modules
  {
    // We're specifying native_modules in the test because the asset relocator loader generates a
    // "fake" .node file which is really a cjs file.
    test: /native_modules\/.+\.node$/,
    use: 'node-loader',
  },
  {
    test: /\.(m?js|node)$/,
    parser: { amd: false },
    use: {
      loader: '@vercel/webpack-asset-relocator-loader',
      options: {
        outputAssetBase: 'native_modules',
      },
    },
  },
  {
    test: /\.tsx?$/,
    exclude: /(node_modules|\.webpack)/,
    use: {
      loader: 'ts-loader',
      options: {
        transpileOnly: true,
      },
    },
  },
];

module.exports.plugins = [new ForkTsCheckerWebpackPlugin()];
