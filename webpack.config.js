/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack');
const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const TerserPlugin = require('terser-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  devtool: process.env.NODE_ENV === 'staging' ? 'inline-source-map' : '',

  mode: 'production',

  entry: './src/index.ts',

  target: 'node',

  externals: [nodeExternals(), { knex: 'commonjs knex' }],

  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'server.js',
  },

  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.tsx', '.(graphql|gql)'],
    modules: ['src'],
    plugins: [new TsconfigPathsPlugin()],
  },

  module: {
    rules: [
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        loaders: 'awesome-typescript-loader',
      },
    ],
  },

  optimization: {
    minimizer: process.env.E2E_BUILD
      ? []
      : [
          new TerserPlugin({
            parallel: true,
            sourceMap: true,
            cache: true,
          }),
        ],
  },

  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: process.env.OPEN_ANALYZER === 'true' ? 'server' : 'disabled',
      openAnalyzer: process.env.OPEN_ANALYZER === 'true',
    }),

    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
    }),
  ],
};
