/**
 * LibraryMode.js
 *
 * Copyright 2017-2018 @Rabbit.
 * 
 */

const webpack = require('webpack')
const { camelCase } = require('lodash')
const pkg = require('./pkg')


const DefaultLibraryModeOptions = {
  isOutputCompressFile: true,
  inputFileName: './src/index.js',
  outputDirectory: './dist',
  outputFileName: '[name].js',
  outputCompressFileName: '[name].min.js',
  compressTools: 'uglify',
  libraryTarget: 'umd',
  excludeNodeModulesDir: false,
  includeSourceDir: false
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



function libMode(options) {
  
  let {
    from,
    to,
    isOutputCompressFile,
    inputFileName,
    outputDirectory,
    outputFileName,
    outputCompressFileName,
    compressTools,
    libraryTarget
  } = Object.assign({}, DefaultLibraryModeOptions, options)

  
  let { name: libName, devDependencies: libDeps } = pkg()


  // Rewrite libName when provide `to` option.
  if(to) {
    if(!/\.js$/.test(to))
      throw new Error(`Bad Output file name: ${to}`)

    libName = outputFileName.split('.js')[0] 
  }

  let commonOptions = {
    entry: {
      [libName]: from || inputFileName
    },
    output: {
      path: outputDirectory,
      library: camelCase(libName),
      libraryTarget: libraryTarget
    },
    module: {
      rules: [{test: /.js$/, loader: 'babel-loader', exclude: ['node_modules']}]
    },
    externals: Object.keys(libDeps),
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
      })
    ]
  }

  function buildLibrary(...args) {
    return Object.assign({}, commonOptions, {
      output: Object.assign({}, commonOptions.output, {
        filename: outputFileName
      })
    })
  }

  function buildCompressFileName(...args) {
    return [

      // Also build Non-min library.
      buildLibrary(args),

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
          })
        )
      })
    ]
  }
  
  return !isOutputCompressFile
    ? buildLibrary
    : buildCompressFileName
}

module.exports = libMode
