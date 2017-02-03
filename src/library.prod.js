//-*- mode: js -*-
//-*- coding: utf8 -*-

/**
 * library.js
 *
 * Copyright 2017-2018 rabbit
 *
 * Librarys production build.
 *
 * @author Rabbit
 */

const entry  = require('./entry').library
const output = require('./output').library
const box    = require('./box').library

const options = Object.assign(
  {},
  entry(),
  output(),
  box()
)

module.exports = options
