//-*- mode: js -*-
//-*- coding: utf-8 -*-

/**
 * box.js
 *
 * Copyright 2017-2018 rabbit
 *
 * Builders.
 * 1.module options
 * 2.devtool
 * 3.devserver
 * 4.hints
 *
 * @see 
 *
 * @author Rabbit
 */


const path = require('path')
const pkg = require(process.cwd() + '/package.json')


/// Loaders ///


/**
 * es-loader.js
 *
 * ES6 loader.
 * 1. Convert JSX to View.
 * 2. Convert ES6 syntax with babel.
 * 3. Cacheable
 *
 * @mode {react}
 * @author Rabbit
 */
function esLoader() {
  return {
    rule: {
      test: /\.jsx?$/,
      use: [{
        loader: 'babel-loader',
        options: {
          cacheDirectory: true
        }
      }]
    },
    exts: ['.jsx']
  }
}


//const ExtractTextPlugin = require('./css').wxappStyle
//const ExtractTextPlugin = require('extract-text-webpack-plugin')
const {
  WeChatAppExtractCSS,
  WeChatAppExtractHTML,
  WeChatAppExtractJSON
} = require('./output')

function cssLoader() {
  return {
    rule: {
      test: /\.css$/,
      loader: WeChatAppExtractCSS.extract({
        loader: [{
          loader: 'css-loader',
          query: {
            modules: true,
            importLoaders: 1
          }
        },{
          loader: 'postcss-loader'
        }]
      })
    },
    exts: ['.css']
  }
}

function htmlLoader() {
  return {
    rule: {
      test: /\.html$/,
      loader: WeChatAppExtractHTML.extract({
        loader: [{
          loader: 'html-loader'
        }]
      })
    },
    exts: ['.html']
  }
}

function jsonLoader() {
  return {
    rule: {
      test: /\.json$/,
      loader: WeChatAppExtractJSON.extract({
        loader: [{
          loader: 'json-loader'
        }]
      })
    }
  }
}


function excludeNodeModulesDir(rule) {
  rule.exclude = [/node_modules/]

  return rule
}

function includeSourceDir(name = 'src') {
  rule.include = [
    path.resolve(__dirname, 'src')
  ]

  return rule
}


// Exts resolver
const defaultExts = ['.js', '.json']


// Alias
// Used for different App mode
// 1.SPA
// 2.Hybrid
// 3.wxapp
function defaultAlias() {

}

function wxappAlias() {

}

function hybridAlias() {

}



/// Hints ///


function hints() {
  return {
    performance: {
      hints: false,
      maxAssetSize: 200000,      // 200kb
      maxEntrypointSize: 200000  // 200kb
    },
    //devtool: 'cheap-module-source-map',
    cache: true
  }
}


function getOrEls(defaultValue, x) {
  return x ? x : defaultValue
}



function box() {
  const esl = esLoader()
  const cssl = cssLoader()
  const htmll = htmlLoader()
  //const jsonl = jsonLoader()
  const mod = function makeModule() {
    return {
      module: {
        rules: [
          esl.rule,
          cssl.rule,
          htmll.rule,
          //jsonl.rule
        ] //.map(excludeNodeModulesDir),
      },
      resolve: {
        extensions: defaultExts.concat(
          esl.exts,
          cssl.exts,
          htmll.exts
        )
      }
    }
  }
  
  return Object.assign(
    {},
    mod(),
    hints()
  )
}


function libraryBox() {
  let deps = pkg.dependencies

  return Object.assign(
    {},
    box(),
    getOrEls({}, { externals: Object.keys(deps) })
  )
}


function wxappBox() {
  let deps = pkg.dependencies

  //console.log(deps)

  return Object.assign(
    {},
    box(),
    getOrEls({}, {
      // externals: (context, request, callback) => {
      //   const isPage = context.match(/pages/)
      //   const libPath =  !isPage ? 'lib' : '../../lib'

      //   if(deps[request]) {
      //     callback(null, `${libPath}/${request}`)
      //     return
      //   }
        
      //   callback()
      // }
      externals: Object.keys(deps)
    })
  )
}



module.exports = box
module.exports.library = libraryBox
module.exports.wxapp = wxappBox
