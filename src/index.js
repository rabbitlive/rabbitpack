//-*- mode: js -*-
//-*- coding: utf8 -*-

/**
 * index.js
 *
 * Copyright 2017-2018 rabbit
 *
 * Webpack Options.
 * Rabbit want to combine webpack options, like:
 *
 * ```
 * 1.Entry -> 2.Box -> 3.Output
 * ```
 *
 * 1.Entry
 * The entry means souce code, it maybe only one
 * `app.js` when project is a SPA, Or multi page
 * project.
 *
 * 2.Box
 * Map from entry to output
 *
 * 3.Output
 * Bundle files. Difference between each evn.
 *
 * @author Rabbit
 */

const entry  = require('./entry')
const output = require('./output')
const box    = require('./box')

const outputPlugins = output.plugins()

const options = Object.assign(
  {},
  entry(),
  output(),
  box(),
  {
    plugins: Object.keys(outputPlugins).map(x => outputPlugins[x])
  }
)

module.exports = options
