// 导入处理路径的模块
const path = require('path');
// 导入自动生成HTMl文件的插件
const htmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const PreloadWebpackPlugin = require('preload-webpack-plugin');
module.exports = {
  entry: path.join(__dirname, '/js/index.js'), // 项目入口文件
  output: { // 配置输出选项
    path: path.join(__dirname, './fishing'), // 配置输出的路径
    filename: 'main.js' // 配置输出的文件名
  },
  devServer: {
    hot: true,
    open: true,
    proxy: {
      '/api': {
        target: 'http://gulusit.cmgame.com',
        changeOrigin: true, // 在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      'imgs': './img'
    }
  },
  plugins: [
    new OptimizeCSSAssetsPlugin(),

    new htmlWebpackPlugin({
      template: path.join(__dirname, '/index.html'),
      filename: 'index.html',
      inject: true
    }),

  

    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),


    new PreloadWebpackPlugin({
      rel: 'preload', 
      include: 'allChunks', // or 'initial', or 'allAssets' 
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // 这里可以指定一个 publicPath
              // 默认使用 webpackOptions.output中的publicPath
              publicPath: './'
            },
          },
          'css-loader',
        ],
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: 'url-loader?limit=5000'
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({//压缩js
        cache: true,
        parallel: true,
        sourceMap: true
      }),

      new OptimizeCSSAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessorOptions: {
          safe: true,
          autoprefixer: { disable: true },
          mergeLonghand: false,
          discardComments: {
            removeAll: true // 移除注释
          }
        },
        canPrint: true
      })
    ],
    splitChunks: {
      chunks: 'all',
      minChunks: 3,
      minSize: 30000,
      maxSize: 1000
    }
  },
}