/**
 * LibraryMode.js
 *
 * Copyright 2017-2018 Rabbit.
 * 
 */

const webpack = require('webpack')
const pkg = require('./pkg')
const { rootPath } = require('./pkg')
const MakeLoaderOptions = require('./MakeLoaderOptions')
const PostcssPlugins = require('./MakeLoaderOptions').PostcssPlugins
const {
  upperFirst,
  camelCase,
  isFunction
} = require('lodash')


const DefaultSPAModeOptions = {
  isOutputCompressFile: true,
  inputFileName: './src/index.js',
  outputDirectory: '/',
  pruductionOutputDirectory: './build',
  outputFileName: '[name].js',
  outputCompressFileName: '[name].min.js',
  compressTools: 'uglify',
  publicPath: '/'
}


function mapCompressToPlugin(name, options = {}) {
  switch(name) {
  case 'uglify': {
    const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
    return new UglifyJSPlugin(options)
  }
    
  case 'closure': {
    const ClosureCompiler = require('google-closure-compiler-js').webpack
    return new ClosureCompiler({
      options: options
    })
  }
    
  default: throw new Error(`Unkonw compress tool name: ${name}`)
  }
}


function makeLibraryName(name, library) {
  if(!library) return upperFirst(camelCase(name))
  if(isFunction(library)) return library(name)
  
  return library
}


function SPAMode(options) {
  
  let {
    from,
    to,
    inputFileName,
    outputDirectory,
    pruductionOutputDirectory,
    outputFileName,
    outputCompressFileName,
    compressTools,
    publicPath
  } = Object.assign({}, DefaultSPAModeOptions, options)

  const ExtractTextPlugin = require('extract-text-webpack-plugin')
  const HtmlWebpackPlugin = require('html-webpack-plugin')
  const HtmlWebpackTemplate = require('html-webpack-template')

  let ExtractCSSPlugin = new ExtractTextPlugin({
    filename: '[name].[hash].css',
    allChunks: true,
    disable: process.env.NODE_ENV !== 'development'
  })


  let commonOptions = {
    entry: {
      app: [
        'react-hot-loader/patch',
        'webpack-dev-server/client',
        'webpack/hot/only-dev-server',
        inputFileName
      ]
    },
    output: {
      publicPath: publicPath
    },
    module: {
      rules: [
        MakeLoaderOptions('js'),
        MakeLoaderOptions('css', {
          extractTextPlugin: ExtractCSSPlugin
        })
      ]
    },
    resolve: {
      extensions: ['.js', '.json', '.jsx', '.css', '.svg', '.png']
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
      }),

      new HtmlWebpackPlugin({
        template: HtmlWebpackTemplate,
        inject: false
      }),

      ExtractCSSPlugin,

      new PostcssPlugins()
    ]
  }

  let serverOptions = {
    //stats: 'normal',
    //contentBase: rootPath(),
    compress: true,
    historyApiFallback: true,
    //publicPath: publicPath,
    //inline: true,
    hot: true,
    port: 9000 
  }


  function buildByDevelopment(...args) {
    return Object.assign({}, commonOptions, {
      output: Object.assign({}, commonOptions.output, {
        filename: outputFileName,
        path: outputDirectory
      }),
      plugins: commonOptions.plugins.concat(
        // HMR
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin()
      ),
      devServer: serverOptions
      //devtool: 'cheap-module-eval-source-map'
    })
  }

  function buildByProduction() {

    const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
    
    return [

      // Also build Non-min library.
      buildLibrary(arguments),

      // Rewrite output.filename
      Object.assign({}, commonOptions, {
        output: Object.assign({}, commonOptions.output, {
          filename: outputCompressFileName
        }),
        plugins: commonOptions.plugins.concat(

          // Compress library
          mapCompressToPlugin(compressTools),
          new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
          }),
          new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
          }),
          new LodashModuleReplacementPlugin()
        )
      })
    ]
  }
  
  return process.env.NODE_ENV !== 'production'
    ? buildByDevelopment
    : buildByProduction
}

module.exports = SPAMode
