//-*- mode: js -*-
//-*- coding: utf8 -*-

/**
 * library.js
 *
 * Copyright 2017-2018 rabbit
 *
 * Webpack Options. Build librarys.
 * What's the difference?
 * 1. Library name always the packageJson.name
 * 2. Library require other librarys maybe define in packageJson.dependencies
 * So...
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
