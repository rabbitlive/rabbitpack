//-*- mode: js -*-
//-*- coding: utf-8 -*-

/**
 * entry.js
 *
 * Copyright 2017-2018 rabbit
 *
 * Webpack entry option, default package for React SPA.
 * 1. React hot reloader patch file, used for dev react app.
 * 2. WDS client, connect to WDS.
 * 3. Active hot reloader when update success.
 *
 * TODO multiEntry.
 * TODO Wechat smart app.
 * TODO Angular framework supports.
 * TODO Typescript.
 *
 * @mode {react}
 * @author Rabbit
 */

const glob = require('glob')
const path = require('path')

const DEFAULTOPTIONS = {
  mainFile: 'index.js',
  sourceDir:  'src'
}

function entry() {
  return {
    entry: [
	    'react-hot-loader/patch',      /* 1 */
	    'webpack-dev-server/client',   /* 2 */
	    'webpack/hot/only-dev-server', /* 3 */
	    './src/index.js'               /* 4 */
	  ]
  }
}


/**
 * Production mode only build the main entry files.
 * Also library.
 */
function simpleEntry() {
  return {
    entry: './src/index.js'
  }
}


const pkg = require(process.cwd() + '/package.json')

function libraryEntry() {
  return {
    entry: {
      [pkg.name]: './src/index.js'
    }
  }
}


/**
 * WeChat app looks like multi entries app.
 *
 * @see https://github.com/rabbitlive/rabbitinit/tree/master/wxapp
 */
function wxappEntry() {

  const regex = /src\/pages\/([^\/]+)\/[^\.]+.js/;
  
  return {
    entry: () => {

      let pages = {}
      let core = []

      glob.sync(`./src/pages/**/*.js`).forEach(x => {
        const name = x.match(regex)[1]
        const key = `pages/${name}/${name}`
        pages[key] = x
      })

      return Object.assign({}, pages, {
        app: [
          //'webpack-dev-server/client',
          //'webpack/hot/only-dev-server',
          './src/app.js'
        ]
      })
    }
  }
}

function wxappLibsEntry() {
  return {
    entry: {
      redux: 'redux'
    }
  }
}


function selfEntry() {
  return {
    entry: {
      wxapp: 'wxapp.js'
    }
  }
}


module.exports = entry
module.exports.simple = simpleEntry
module.exports.library = libraryEntry
module.exports.wxapp = wxappEntry
module.exports.wxappLibs = wxappLibsEntry
