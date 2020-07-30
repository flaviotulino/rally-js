const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
// const nodeExternals = require('webpack-node-externals');
const NodemonPlugin = require('nodemon-webpack-plugin'); // Ding
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const merge = require('webpack-merge');

const project = process.env.PROJECT;

const configPath = path.resolve(project, 'rally-js');
/* eslint-disable import/no-dynamic-require */
const overrides = fs.existsSync(configPath) ? require(configPath) : {};
/* eslint-enable */

const controllersPath = overrides.paths ? overrides.paths.controllers : path.join('src', 'controllers');
const modelsPath = overrides.paths ? overrides.paths.models : path.join('src', 'models');
const viewsPath = overrides.paths ? overrides.paths.views : path.join('src', 'views');

const isProduction = process.env.NODE_ENV === 'production';

const config = merge({
  entry: {
    server: path.resolve(project, 'src', 'index'),
  },
  mode: isProduction ? 'production' : 'development',
  target: 'node',
  // externals: [nodeExternals()],

  devtool: isProduction ? false : 'eval-cheap-module-source-map',
  output: {
    path: path.join(project, 'dist'),
    filename: '[name].js',
  },

  stats: {
    assets: false,
    chunks: false,
    modules: false,
    hash: false,
    builtAt: false,
    entrypoints: false,
    version: false,
    timings: false,
    logging: 'error',
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: path.resolve(__dirname, 'tsconfig.json'),
          },
        },
        include: [
          path.resolve(__dirname, 'src'),
          project,
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        include: [
          path.resolve(__dirname, 'src'),
          project,
        ],
        exclude: [
          /node_modules/,
        ],
      },
    ],
  },
  resolve: {

    extensions: ['.tsx', '.ts', '.json', '.js'],

    modules: [
      'node_modules',
      path.resolve(__dirname, 'node_modules'),
      path.resolve(project, 'node_modules'),

    ],
    alias: {
      // 'server-template/ORM': path.join(__dirname, 'ORM'),
      // 'server-template': path.join(__dirname, 'src'),
    },
  },
  plugins: [
    new NodemonPlugin({
      watch: path.join(project, 'dist'),
      verbose: false,
      quiet: true,
    }),
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      controllersPath: JSON.stringify(path.resolve(project, controllersPath)),
      modelsPath: JSON.stringify(path.resolve(project, modelsPath)),
      viewsPath: JSON.stringify(path.resolve(project, viewsPath)),
    }),
  ],

//   optimization: {
//     runtimeChunk: 'single',
//     splitChunks: {
//       cacheGroups: {
//         vendor: {
//           test: /[\\/]node_modules[\\/]/,
//           name: 'vendors',
//           chunks: 'all'
//         }
//       }
//     }
//   }
}, overrides.webpack || {});

module.exports = config;
