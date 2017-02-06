const glob = require('glob')

function resolveUmdPath(name) {
  const umdlibs = glob.sync(`node_modules/${name}/dist/*.js$`).sort()

  if(!umdlibs.length) console.warn(`Can't find ${name} UMD version libs.`)

  return (__DEV__ ? umdlibs : umdlibs.reverse())[0]
}


module.exports = resolveUmdPath
