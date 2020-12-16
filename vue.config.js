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
      nodeIntegration: true,
      // preload: 'src/server.js',

      builderOptions: {
        appId: 'hardocs.github.io',
        productName: 'Hardocs Desktop',
        // copyright: '',
        publish: {
          provider: 'github'
        },
        linux: {
          target: 'snap',
          category: 'System'
          // icon: 'src/assets/icons/icon.png'
        },
        win: {
          target: 'zip'
          // oneClick: true,
          // category: 'System',
          // icon: 'src/assets/icons/icon.ico'
          // uninstallerIcon: 'src/assets/icons/icon.ico',
          // shortcutName: 'Hardocs'
        },
        mac: {
          category: 'public.app-category.utilities',
          target: 'zip'
          // publish: ['github']
          // icon: 'src/assets/icons/icon.icns'
          // type: 'dis'
        },
        // options placed here will be merged with default configuration and passed to electron-builder
        files: ['**/*'],
        extraFiles: [
          {
            from: 'guides',
            to: 'guides',
            filter: ['**/*']
          }
        ]
      }
    }
  }
};
