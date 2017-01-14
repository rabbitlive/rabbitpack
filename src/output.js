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
const devPath  = path.resolve(__dirname)
const prodPath = path.resolve(__dirname, 'dist')


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


const webpack             = require('webpack')
const ManifestPlugin      = require('webpack-manifest-plugin')
const ChunkManifestPlugin = require('chunk-manifest-webpack-plugin')
const HtmlWebpackPlugin   = require('html-webpack-plugin')
const template            = require('html-webpack-template')
const ExtractTextPlugin   = require('extract-text-webpack-plugin')


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
