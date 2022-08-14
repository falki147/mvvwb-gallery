const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { version } = require('./package.json');

module.exports = {
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'style.css'
    }),
    new CopyPlugin({
      patterns: [
        {
          from: 'src',
          transform: (content) => content.toString().replace(/\{\{version\}\}/g, version),
        },
      ],
    }),
  ],
  entry: {
    index: './js/index.js'
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { url: false }
          },
          'sass-loader',
        ],
      },
    ],
  },
  resolve: {
    alias: {
      'photoswipe': path.resolve(__dirname, './node_modules/photoswipe'),
    },
  },
};

