const webpack = require('webpack');
const fs = require('fs');

// import webpack from 'webpack'
// import fs from 'fs'
const packageJson = fs.readFileSync('./package.json');
const version = JSON.parse(packageJson).version || 0;

module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          HD_APP_VERSION: '"' + version + '"'
        }
      })
    ]
  },
  chainWebpack: config => config.resolve.set('symlinks', false),
  pluginOptions: {
    electronBuilder: {
      // preload: 'src/server.js',
      nodeIntegration: true,
      linux: {
        target: 'deb',
        category: 'System'
      },
      builderOptions: {
        // options placed here will be merged with default configuration and passed to electron-builder
        files: [
          "**/*"
        ],
        extraFiles: [
          {
              "from": "guides",
              "to": "guides",
              "filter": ["**/*"]
          }
        ]
      }
    },

  }
};
