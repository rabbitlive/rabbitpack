//-*- mode: js -*-
//-*- coding: utf-8 -*-

/**
 * output.js
 *
 * Copyright 2017-2018 rabbit
 *
 * output bundles.
 * 1. Dev mode build in memory
 * 2. Prod mode build to '/dist' directory
 *
 * @see https://webpack.js.org/configuration/output/
 * @author Rabbit
 */

const path = require('path')

// What's the problem with `publicPath` prop? from Webpack doc:
//
// This is an important option when using on-demand-loading or loading
// external resources like images, files, etc. If an incorrect value
// is specified you'll receive 404 errors while loading these resources.
//
// The default value is an empty string "".
// You can also find public path with WDS options.
// Path '//' auto match the protrol.
const publicPath = '//'

// Did you mind the build path?
// Also the name
const devPath  = './'
const prodPath = './dist'

const pkg = require(process.cwd() + '/package.json')

module.exports = function output() {
  return {
	  output: {
	    path: devPath,
	    filename: '[name].js',
	    publicPath: publicPath
	  }
  }
}

module.exports.production = {
  path: prodPath,
  filename: '[name].[chunkhash].js',
  publicPath: publicPath
}

const webpack           = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyJSPlugin    = require('uglifyjs-webpack-plugin');


module.exports.library = function outputLibrary() {
  const commons = {
	  path: prodPath,
	  publicPath: publicPath,
	  library: pkg ? pkg.name : path.basename(process.cwd()),
	  libraryTarget: 'umd'
  }

  return [{
	  output: Object.assign({}, commons, {
	    filename: '[name].js'
	  })
  },{
	  output: Object.assign({}, commons, {
	    filename: '[name].min.js'
	  }),
	  plugins: [
	    new UglifyJSPlugin()
	  ]
  }]
}

const glob = require('glob')

function resolveUmdPath(name) {
  const umdlibs = glob.sync(`./node_modules/${name}/dist/*.js`).sort()

  if(!umdlibs.length) console.warn(`Can't find ${name} UMD version libs.`)

  return (process.env.NODE_ENV !== 'production' ? umdlibs : umdlibs.reverse())[0]
}

function copyLibToWxappLibdir(name) {
  return {
	  from: resolveUmdPath(name),
	  to: process.env.NODE_ENV !== 'production' ? `lib/${name}.js` : `lib/${name}.min.js`
  }
}

const ReplaceLibRequirePathPlugin = require('./ReplaceLibRequirePath')

const WeChatAppExtractCSS = new ExtractTextPlugin({
	filename: '[name].wxss',
	allChunks: true
})
const WeChatAppExtractHTML = new ExtractTextPlugin({
	filename: '[name].wxml',
	allChunks: true
})
const WeChatAppExtractJSON = new ExtractTextPlugin({
	filename: '[name].json',
	allChunks: true
})

module.exports.WeChatAppExtractCSS = WeChatAppExtractCSS
module.exports.WeChatAppExtractHTML = WeChatAppExtractHTML
module.exports.WeChatAppExtractJSON = WeChatAppExtractJSON

function wxappOutput() {

  const deps = pkg.dependencies

  // remove **Redux**, Because redux UMD has a bug, when root and global objects both lost.
  const copylibs = Object.keys(deps)
        .filter(key => key !== 'redux')
        .map(key => copyLibToWxappLibdir(key))
  
  return {
	  output: {
	    path: prodPath,
	    filename: '[name].js',
	    publicPath: publicPath,
	    libraryTarget: 'commonjs2'
	  },
	  plugins: [
	    new CopyWebpackPlugin([

		    // Copy root config to dist/
		    //{ from: './src/app.json', to: './' },

		    // TODO file ext need custom setting with `viewFileExt: String = 'html'` 
		    //{ from: './pages/**/*.json', to: '[path][name].json', context: 'src' },
		    //{ from: './pages/**/*.+(html|wxml)', to: '[path][name].wxml', context: 'src' },

		    // Copy libs
		      ...copylibs
	    ]),

      WeChatAppExtractCSS,
      WeChatAppExtractHTML,
      WeChatAppExtractJSON,

	    new webpack.LoaderOptionsPlugin({
		    options: {
		      postcss: []
		    }
	    }),

	    new ReplaceLibRequirePathPlugin()
	  ]
  }
}

function wxappLibsOutput() {
  return {
	  output: {
	    path: path.resolve(prodPath, 'lib'),
	    filename: '[name].js',
	    publicPath: publicPath,
	    libraryTarget: 'umd'
	  }
  }
}

module.exports.wxapp = wxappOutput
module.exports.wxappLibs = wxappLibsOutput


const ManifestPlugin      = require('webpack-manifest-plugin')
const ChunkManifestPlugin = require('chunk-manifest-webpack-plugin')
const HtmlWebpackPlugin   = require('html-webpack-plugin')
const template            = require('html-webpack-template')


module.exports.plugins = function outputPlugins() {
  return {
	  html: new HtmlWebpackPlugin({
	    template: template,
	    title: 'App'
	  })
  }
}


/*
  module.exports.plugins = {

  // You really need combine commons code with SPA?
  // @mode {MultiEntry}
  commons: new webpack.optimize.CommonsChunkPlugin({
  name: 'commons',
  filename: 'commons.[chunkhash].js',
  minChunks: Infinity,
  }),

  // Generate manifest file for long team cache.
  // @env {Production}
  manifest: new ManifestPlugin({
  filename: 'app-manifest.json',
  }),
  chunkManifest: new ChunkManifestPlugin({
  filename: 'chunk-manifest.json',
  manifestVariable: 'Manifest'
  }),

  // Output HTML file
  // Just for dev mode
  html: new HtmlWebpackPlugin({
  template: template,
  title: 'App'
  }),

  ['html.production']: new HtmlWebpackPlugin({
  template: template,
  title: 'App',
  // minify
  minify: {
  removeTagWhitespace: true,
  collapseWhitespace: true
  },
  scripts: [
  ]
  }),


  // Output style file
  style: new ExtractTextPlugin({
  filename: 'app.[chunkhash].css',
  allChunks: true
  })

  }
*/
