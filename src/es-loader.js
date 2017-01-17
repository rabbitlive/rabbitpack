//-*- mode: js -*-
//-*- coding: utf-8 -*-

/**
 * js-loader.js
 *
 * Copyright 2017-2018 rabbit
 *
 * Javascript loader.
 * 1. Convert JSX to View.
 * 2. Convert ES6 syntax with babel.
 * 3. Babel-loader cacheable
 *
 * @mode {react}
 * @author Rabbit
 */

const tester = /\.jsx?$/;

module.exports = {
  test: tester,
  use: [{
    loader: 'babel-loader',
    options: {
      cacheDirectory: true
    }
  }]
}

module.exports.production = {
  test: tester,
  use: [{
    loader: 'babel-loader'
  }]
}
