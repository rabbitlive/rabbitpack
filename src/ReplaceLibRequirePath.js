/**
 * ReplaceLibRequirePath.js
 *
 * Used for wxapp replace lib require path.
 * 1. Remember the lib should be apply { externals } option.
 */

const RawSource = require("webpack-sources").RawSource;

module.exports = class ReplaceLibRequirePath {
  apply(compiler) {
	  compiler.plugin('compilation', function(compilation, callback) {
	    compilation.moduleTemplate.plugin('module', function(moduleSource, module, chunk){
		    if(moduleSource instanceof RawSource) {
          if(/^module\.exports\s+=\s+require\(/.test(moduleSource._value)) {
		        if(/^pages/.test(chunk.name)) {
			        return new RawSource(`module.exports = require('../../lib/${module.request}')`)
		        } else {
			        return new RawSource(`module.exports = require('lib/${module.request}')`)
		        }
          }
		    }
		    return moduleSource
	    })
	  })
  }
}
