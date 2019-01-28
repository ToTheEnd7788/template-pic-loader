import path from 'path';

let srcRoot = path.resolve(__dirname, 'src'),
  distRoot = path.resolve(__dirname, '../dist');

export default {
  context: srcRoot,

  entry: {
    index: ['./index.js']
  },

  output: {
    path: distRoot,
    filename: '[name].js'
  },

  mode: 'production',

  resolve: {
    alias: {
      '__imgs': path.resolve(srcRoot, 'imgs')
    }
  },

  resolveLoader: {
    modules: [
      path.resolve(__dirname, '../src/'),
      'node_modules'
    ]
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.html$/,
        // Use template-pic-loader
        use: [
          {
            loader: 'loader.js',
            options: {
              self: false,
              condition: [ 'link?rel=icon:href', 'img:src' ]
            }
          }
        ]
      },
      {
        test: /\.png$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1,
              name: '[name].[ext]'
            }
          }
        ]
      }
    ]
  }
};