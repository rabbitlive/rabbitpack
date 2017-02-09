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
 * 4. wxapp can't require node_modules.
 * 5. wxapp don't have root object.
 * So, if your view layer is pure function & stateless components...
 *
 * @author Rabbit
 */

const entry  = require('./entry')
const output = require('./output')
const box    = require('./box')

const options = [
  Object.assign(
    {},
    entry.wxapp(),
    output.wxapp(),
    box.wxapp()
  ),
  Object.assign(
    {},
    entry.wxappLibs(),
    output.wxappLibs(),
    box.library(),
    {
      externals: undefined
    }
  )
]

module.exports = options
