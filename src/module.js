//-*- mode: js2 -*-
//-*- coding: utf-8 -*-

/**
 * module.js
 *
 * Copyright 2017-2018 rabbit
 *
 * Combine loaders.
 * 1. javascript
 * 2. css
 * 3. html
 * 4. other
 *
 * @mode {react}
 * @author Rabbit
 */

module.exports = {
  rules: [
    require('./js-loader')
  ]
}

module.exports.production = {
  rules: [
    require('./js-loader').production
  ]
}
