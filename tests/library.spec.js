//-*- mode: js -*-
//-*- coding: utf8 -*-

/**
 * dev.spec.js
 */

const fs      = require('fs')
const path    = require('path')
const glob    = require('glob')
const spawn   = require('child_process').spawnSync;
const webpack = require('webpack')
const options = require('./../src/library')

describe('package library.', () => {

  let uuid   = Date.now()
  let prefix = 'test'

  // remove test dirs
  spawn('rm', ['-rf', 'tmp/' + prefix + '_*'])


  let target = path.resolve(__dirname, '../tmp', [prefix, uuid].join('_'))
  fs.mkdirSync(target)
  fs.mkdirSync(path.join(target, 'build'))
  fs.mkdirSync(path.join(target, 'src'))
  fs.writeFileSync(path.resolve(target, 'package.json'), `{}`, 'utf-8')
  fs.writeFileSync(path.resolve(target, 'src/app.js'), `console.log(42)`, 'utf-8')

  function webpackPromise() {
    return new Promise((resolve, reject) => {
      options.context = target
      options.output.path = path.resolve(path.resolve(target, 'build'))
      let compile = webpack(options)
      compile.run((err, stats) => {
        if(err) reject(err)
        if(stats.hasErrors()) reject(stats.errorDetails)
        console.log(stats.toString())
        resolve(fs.readFileSync(path.resolve(target, 'build/app.js')))
      })
    })
  }

  it('', () => {
    return webpackPromise().then(res => {
      expect(res).toBe('console.log(42)')
    })
  })
})
