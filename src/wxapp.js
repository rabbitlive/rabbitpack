//-*- mode: js -*-
//-*- coding: utf8 -*-

/**
 * wxapp.js
 *
 * Copyright 2017-2018 rabbit
 *
 * Webpack Options. Build Wechat smart App.
 * 1. wxapp max bundle size was 1MB
 * 2. wxapp use Pods directory struct.
 * 3. wxapp was most likely Vue.
 * So, if your view layer is pure function & stateless components...
 *
 * @author Rabbit
 */

const entry  = require('./entry').wxapp
const output = require('./output').wxapp
const box    = require('./box').wxapp

const options = Object.assign(
  {},
  entry(),
  output(),
  box()
)

console.log(options)

module.exports = options
