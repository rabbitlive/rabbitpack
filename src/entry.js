//-*- mode: js -*-
//-*- coding: utf-8 -*-

/**
 * entry.js
 *
 * Copyright 2017-2018 rabbit
 *
 * Webpack entry option, default for react SPA.
 * 1. React hot reloader patch file, used for dev react app.
 * 2. WDS client, connect to WDS.
 * 3. Active hot reloader when update success.
 *
 * TODO multiEntry
 * TODO Angular framework supports
 *
 * @mode {react}
 * @author Rabbit
 */

const path = require('path')

const DEFAULT = {
  entryfile: 'index',
  entrydir:  'src'
}


module.exports = function entry() {
  return {
    entry: {
	    main: [
	      'react-hot-loader/patch',      /* 1 */
	      'webpack-dev-server/client',   /* 2 */
	      'webpack/hot/only-dev-server', /* 3 */
	      './src/index.js'               /* 4 */
	    ]
    }
  }
}


/**
 * Production mode only build the main entry files.
 */
module.exports.simple = function simpleEntry() {
  return {
    entry: {
	    main: './src/index.js'
    }
  }
}


function makeEntry(key) {
  return {
	  [key]: [ 'src/' + key + '.js' ]
  }
}

module.exports.multiEntry = patten => {
  return {
	  entry: {

	  }
  }
}
