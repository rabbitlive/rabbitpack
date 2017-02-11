const MakeLoaderOptions = require('../src/MakeLoaderOptions')
const extractTextPlugin = require('extract-text-webpack-plugin')

console.log(
  MakeLoaderOptions('js'),
  MakeLoaderOptions('sass', {
    extractTextPlugin: new extractTextPlugin({
      filename: '[name].css'
    }) 
  })
)
