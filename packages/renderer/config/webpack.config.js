const { rules, plugins } = require('@gpp/webpack');

rules.push({
  test: /\.css$/,
  use: [
    'style-loader',
    'css-loader',
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: ['tailwindcss', 'autoprefixer'],
        },
      },
    },
  ],
});

module.exports = {
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
  },
  devtool: 'source-map',
};
