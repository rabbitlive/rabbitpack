/**
 * Mode
 */

function mode(name, options) {
  if(!name) throw new Error('name is required')

  return (from, to) => {
    switch(name) {
    case 'spa':
      return require('./ReactReduxSPAMode')(from, to, options)
    case 'lib':
    case 'library':
      return require('./LibraryMode')(from, to, options)
    default: throw new Error(`Unknow mode: ${name}`)
    }
  }
}

module.exports = mode
