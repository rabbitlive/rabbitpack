//-*- mode: js -*-
//-*- coding: utf-8 -*-

/**
 * env.js
 *
 * Copyright 2017-2018 rabbit
 *
 * Webpack DefinePlugin
 * 1. Define environment to runtime
 * 2. Copy config to runtime by env
 * 3. User costom defined
 *
 * But the Nodejs ENV is not the webpack ENV, wtf?
 * So, need to sync [Nodejs, Webpack, Browser] env.
 *
 * @mode {react}
 * @author Rabbit
 */

const fs      = require('fs')
const glob    = require('glob')
const path    = require('path')
const webpack = require('webpack')


// Ok, find env mode
const env = process.env.NODE_ENV


function makeEnv() {
  // Define the env vars.
  const __DEV__  = env === 'development'
  const __PROD__ = env === 'production'
  const __TEST__ = env === 'test'
  const __PRO__  = env === 'prerelease'
  const __DEP__  = env === 'deployment'
  
  return {
    __DEV__: __DEV__,
    __PROD__: __PROD__,
    __TEST__: __TEST__,
    __PRO__: __PRO__,
    __DEP__: __DEP__,
    'process.env': {
      'NODE_ENV': JSON.stringify(env || 'development')
    }
  }
}


// Try read config file from `/config` directory.
// And the file name is ..., .rabbitrc?
// 
// TODO upward find the package.json
function readConfig() {
  const patten = `${process.cwd()}/config/*.json`
  return glob.sync(patten).reduce((acc, curr) => {
    var ctx = !env ? require(curr) : require(curr)[env]
    return Object.assign({}, acc, ctx)
  }, {})
}


// But i think you only need this.
module.exports = new webpack.DefinePlugin(
  'process.env': {
    'NODE_ENV': JSON.stringify(env || 'development')
  }
)


module.exports.extra = new webpack.DefinePlugin(
  Object.assign({}, makeEnv(), readConfig())
)
