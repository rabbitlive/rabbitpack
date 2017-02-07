const webpack = require('webpack')
const { camelCase } = require('lodash')
const pkg = require('./pkg')


const DefaultLibmodeOptions = {
  isOutputCompressFile: true,
  outputFileName: '[name].js',
  outputCompressFileName: '[name].min.js',
  inputFileName: './src/index.js',
  compressTools: 'uglify',
  libraryTarget: 'umd'
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
  const {
    from,
    to,
    isOutputCompressFile,
    inputFileName,
    outputFileName,
    outputCompressFileName,
    compressTools,
    libraryTarget
  } = Object.assign({}, DefaultLibmodeOptions, options)

  const libName = pkg().name
  const libDeps = pkg().devDependencies

  const commonOptions = {
    entry: {
      [libName]: from || inputFileName
    },
    output: {
      path: './dist',
      library: camelCase(libName),
      libraryTarget: 'umd'
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
      buildLibrary(args),
      
      Object.assign({}, commonOptions, {
        output: Object.assign({}, commonOptions.output, {
          filename: outputCompressFileName
        }),
        plugins: commonOptions.plugins.concat(
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
