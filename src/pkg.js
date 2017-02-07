const path = require('path')
const fs   = require('fs')

const rootFile = 'package.json'

function isRoot(dirpath) {
  let rootFilePath = path.resolve(dirpath, rootFile)

  return fs.existsSync(rootFile)
}

function rootPath() {
  let hasRootFile = isRoot(process.cwd())

  if(!hasRootFile) throw new Error('Current directory not root path.')
  return path.resolve(process.cwd()) 
}

function pkg() {
  let pkgFilePath = path.resolve(rootPath(), rootFile)

  return require(pkgFilePath)
}

module.exports = pkg
module.exports.rootPath = rootPath
module.exports.isRoot = isRoot
