//-*- mode: js -*-
//-*- coding: utf8 -*-

/**
 * wxapp.spec.js
 */

const fs      = require('fs')
const path    = require('path')
const glob    = require('glob')
const spawn   = require('child_process').spawnSync;
const webpack = require('webpack')
const opt = require('./../src/wxapp')

describe('package library.', () => {

  let uuid   = Date.now()
  let prefix = 'test'


  let target = path.resolve(__dirname, '../tmp', [prefix, uuid].join('_'))
  fs.mkdirSync(target)
  fs.mkdirSync(path.join(target, 'build'))
  fs.mkdirSync(path.join(target, 'src'))
  fs.mkdirSync(path.join(target, 'src/pages'))
  fs.mkdirSync(path.join(target, 'src/pages/foo'))
  fs.mkdirSync(path.join(target, 'src/pages/bar'))
  fs.writeFileSync(path.resolve(target, 'package.json'), `{}`, 'utf-8')
  fs.writeFileSync(path.resolve(target, 'src/app.js'), `App({})`, 'utf-8')
  fs.writeFileSync(path.resolve(target, 'src/app.json'), `{}`, 'utf-8')
  fs.writeFileSync(path.resolve(target, 'src/app.css'), ``, 'utf-8')
  fs.writeFileSync(path.resolve(target, 'src/index.js'), `console.log(42)`, 'utf-8')
  fs.writeFileSync(path.resolve(target, 'src/pages/foo/index.js'), `Page({})`, 'utf-8')
  fs.writeFileSync(path.resolve(target, 'src/pages/foo/index.html'), `<page>foo</page>`, 'utf-8')
  fs.writeFileSync(path.resolve(target, 'src/pages/foo/index.css'), ``, 'utf-8')
  fs.writeFileSync(path.resolve(target, 'src/pages/bar/index.js'), `Page({})`, 'utf-8')
  fs.writeFileSync(path.resolve(target, 'src/pages/bar/index.html'), `<page>bar</page>`, 'utf-8')
  fs.writeFileSync(path.resolve(target, 'src/pages/bar/index.css'), ``, 'utf-8')

  function webpackPromise() {
    return new Promise((resolve, reject) => {
      let options = opt(target)
      console.log(options)
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
