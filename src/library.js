//-*- mode: js -*-
//-*- coding: utf8 -*-

/**
 * library.js
 *
 * Copyright 2017-2018 rabbit
 *
 * Webpack Options. Build library
 *
 * @author Rabbit
 */

const entry  = require('./entry').simple
const output = require('./output').library
const box    = require('./box')

const options = Object.assign(
  {},
  entry(),
  output(),
)

module.exports = options
