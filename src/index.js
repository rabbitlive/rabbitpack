//-*- mode: js2 -*-
//-*- coding: utf8 -*-

if(process.env.NODE_ENV) {
  module.exports = {
	  entry: require('entry')
  }
} else {
  module.exports = {
	  entry: require('entry.production')
  }
}
