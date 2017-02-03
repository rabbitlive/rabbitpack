const env = process.env.NODE_ENV
const __DEV__  = env === 'development'
const __PROD__ = env === 'production'
const __TEST__ = env === 'test'
const __PRO__  = env === 'prerelease'
const __DEP__  = env === 'deployment'

function envExport() {
  return {
    __DEV__,
    __PROD__,
    __TEST__,
    __PRO__,
    __DEP__,
  }
}

module.exports.__DEV__  = __DEV__
module.exports.__PROD__ = __PROD__
module.exports.__TEST__ = __TEST__
module.exports.__PRO__  = __PRO__
module.exports.__DEP__  = __DEP__
module.exports = envExport()
