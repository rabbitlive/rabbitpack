//-*- mode: js -*-
//-*- coding: utf8 -*-

/**
 * index.js
 *
 * Copyright 2017-2018 rabbit
 *
 * Rabbitpack want to build itself.
 * Ok, at first, this project are export multi librarys. 
 *
 * @author Rabbit
 */

const entry  = require('./entry').library
const output = require('./output').library
const box    = require('./box').library

const options = [
  Object.assign(
    {},
    entry.wxapp(),
    output.wxapp(),
    box()
  ),
  Object.assign(
    {},
    entry.wxappLibs(),
    output.wxappLibs(),
    box()
  )
]

module.exports = options
