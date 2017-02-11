const libraryMode = require('../src/libraryMode')

let defaultLibraryBuilderOptions = libraryMode({
  libraryTarget: 'commonjs2'
})() 

console.log(
  defaultLibraryBuilderOptions,
  defaultLibraryBuilderOptions.map(x=>x.module),
  defaultLibraryBuilderOptions.map(x=>x.plugins)
)
