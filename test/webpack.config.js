import path from 'path';

let srcRoot = path.resolve(__dirname, 'src'),
  distRoot = path.resolve(__dirname, '../dist'),
  imgs = path.resolve(__dirname, 'imgs');

export default {
  context: srcRoot,

  entry: {
    app: ['./app.js'],
    index: ['./index.js']
  },

  output: {
    path: distRoot,
    filename: '[name].js',
    publicPath: '/dist'
  },

  mode: 'development',

  resolve: {
    alias: {
      '__imgs': imgs
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
              condition: [ 'link?rel=icon:href', 'img:src' ],
              extract: true,
              filename: '[name].[ext]',
              minimize: true
            }
          }
        ]
      },
      {
        test: /\.(png|ico)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 90,
              name: 'imgs/[name]~[hash:8].[ext]'
            }
          }
        ]
      }
    ]
  }
};