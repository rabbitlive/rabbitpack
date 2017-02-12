/**
 * LibraryMode.js
 *
 * Copyright 2017-2018 @Rabbit.
 * 
 */

const webpack = require('webpack')
const pkg = require('./pkg')
const MakeLoaderOptions = require('./MakeLoaderOptions')
const {
  upperFirst,
  camelCase,
  isFunction,
  assign,
  update
} = require('lodash')


const DefaultLibraryModeOptions = {
  isOutputCompressFile: true,
  inputFileName: './src/index.js',
  outputDirectory: './dist',
  outputFileName: '[name].js',
  outputCompressFileName: '[name].min.js',
  compressTools: 'uglify',
  libraryTarget: 'umd',
  extname: 'js',
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


function makeLibraryName(name, library) {
  if(!library) return upperFirst(camelCase(name))
  if(isFunction(library)) return library(name)
  
  return library
}


function libraryMode(options) {
  
  let {
    from,
    to,
    isOutputCompressFile,
    inputFileName,
    outputDirectory,
    outputFileName,
    outputCompressFileName,
    compressTools,
    libraryTarget,
    library,
    extname,
    externals
  } = Object.assign({}, DefaultLibraryModeOptions, options)

  
  let { name: libName, dependencies: libDeps = {} } = pkg()

  // Rewrite libName when provide `to` option.
  if(to) {
    if(!/\.js$/.test(to))
      throw new Error(`Bad Output file name: ${to}, it need a file name like 'example.js'`)

    let splited = to.split('.js')[0]
    libName = splited[0]
    extname = splited[1]
  }


  let commonOptions = {
    entry: {
      [libName]: from || inputFileName
    },
    output: {
      path: outputDirectory,
      library: makeLibraryName(libName, library),
      libraryTarget: libraryTarget
    },
    module: {
      rules: [
        MakeLoaderOptions('js')
      ]
    },
    externals: externals ? externals : Object.keys(libDeps),
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
      }),
      plugins: [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
        })
      ]
    })
  }

  function buildCompressFileName() {

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
  
  return !isOutputCompressFile
    ? buildLibrary
    : buildCompressFileName
}

module.exports = libraryMode
