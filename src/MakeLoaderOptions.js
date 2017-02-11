const { isString, isArray, isFunction } = require('lodash')

const env = process.env.NODE_ENV || 'development'

const DefaultLoaderOptions = {
  excludeNodeModulesDir: false,
  includeSourceDir: false
}


function mapOptionTypeToProp(key, option) {
  return {
    if(!option) return {}

    if(isString(key)) {
      return {[key]: [option]}
    } else if(isArray(key)) {
      return {[key]: option}
    } else if(isFunction(key)) {
      return option(key)
    } else {
      console.warn(`Unsupports options type ${option} for ${key}.`)
      return {}
    }
  }
}


/**
 * CSSLoader
 *
 * option.root: String = '/'
 * option.modules: Boolean = false
 * option.import: Boolean = true
 * option.url: Boolean = true
 * option.minimize: {Boolean|Object<any>} = false
 * option.sourceMap: Boolean = false
 * option.camelCase: Boolean = false
 * option.importLoaders: Number = 0
 *
 * @link [css-loader](https://github.com/webpack-contrib/css-loader)
 * @link [css nano](http://cssnano.co/optimisations/)
 */
function cssLoaderOptions(options) {
  const DefaultCSSLoaderOptions = {
    modules: true,
    importLoaders: 1,
    camelCase: true,
    sourceMap: true
    minimize: false
  }
  
  return {
    loader: 'css-loader',
    options: Object.assign({}, DefaultCSSLoaderOptions, options, {
      minimize: options.env === 'development' ? false : true
    })
  }
}


/**
 * PostcssLoader
 *
 * option.parser: String? = undefined 
 * option.plugins: () => Array<any> = () => []
 * option.sourceMap: Boolean = false
 *
 * @link [postcss](https://github.com/postcss/postcss)
 * @link [postcss-loader](https://github.com/postcss/postcss-loader)
 * @link [postcss api](http://api.postcss.org/)
 * @link [lostgrid](https://github.com/peterramsing/lost)
 */
function postcssLoaderOptions(options) {

  const short   = require('postcss-short')
  const nesting = require('postcss-nesting')
  const mixins  = require('postcss-mixins')
  const colorfx = require('postcss-color-function')

  const DefaultPostcssLoaderOptions = {
    sourceMap: 'inline',
    plugins: [
      short(),
      mixins(),
      colorfx(),
      mixins()
    ]
  }
  
  return {
    loader: 'postcss-loader',
    options: Object.assign({}, DefaultPostcssLoaderOptions, options, {
      plugins: DefaultPostcssLoaderOptions.plugins.concat(options.plugins)
    })
  }
}

/**
 * SassLoader
 *
 * option.data: String? = null
 * option.includePaths: Array<String> = []
 * option.sourceMap: (Boolean|String)? = undefined 
 *
 * @link [sass-loader](https://github.com/jtangelder/sass-loader)
 * @link [node-sass](https://github.com/sass/node-sass)
 * @link [getting started with css sourcemaps](https://medium.com/@toolmantim/getting-started-with-css-sourcemaps-and-in-browser-sass-editing-b4daab987fb0)
 */
function sassLoaderOptions(options) {
  const DefaultSassLoaderOptions = {
    sourceMap: true
  }
  
  return {
    loader: 'sass-loader',
    options: Object.assign({}, DefaultSassLoaderOptions, options, {
      data: `$env: ${options.env};`
    })
  }
}


/**
 * LessLoader
 *
 * option.globalVar: String? = null
 * option.paths: Array<String> = []
 * option.noIeCompat: Boolean = false
 * option.strictMath: Boolean = false
 * option.lessPlugins: Array<any> = []
 *
 * @link [less-loader](https://github.com/webpack-contrib/less-loader)
 * @link [less](https://github.com/less/less.js)
 * @link [less docs](https://github.com/less/less-docs)
 * @link [less plugins](http://lesscss.org/usage/#plugins-list-of-less-plugins)
 */

function lessLoaderOptions(options) {
  const CleanCSSPlugin = require('less-plugin-clean-css')
  
  const DefaultLessLoaderOptions = {
    noIeCompat: true, 
    strictMath: true,
    sourceMap: true,
    lessPlugins: [
      new CleanCSSPlugin({advanced: true})
    ]
  }
  
  return {
    loader: 'less-loader',
    options: Object.assign({}, DefaultLessLoaderOptions, options, {
      globalVar: `env=${options.env}`,
      lessPlugins: DefaultLessLoaderOptions.lessPlugins.concat(options.lessPlugins)
    })
  }
}

/*
 * HtmlLoader
 * 
 * @link [html-loader](https://github.com/webpack-contrib/html-loader)
 * @link [HtmlMinifier](https://github.com/kangax/html-minifier)
 */
function htmlLoaderOptions(options) {
  return {
    loader: 'html-loader',
    options: Object.assign({}, options, {
      minimize: options.env === 'development' ? false : true
    })
  }
}

/*
 * PostHtmlLoader
 * 
 * @link [posthtml-loader](https://github.com/posthtml/posthtml)
 * @link [posthtml plugin](https://github.com/posthtml/posthtml-plugin-boilerplate)
 * @link [posthtml-lorem](https://github.com/jonathantneal/posthtml-lorem)
 * @link [posthtml-md](https://github.com/jonathantneal/posthtml-md)
 */
function postHtmlLoaderOptions(options) {
  const markdown = require('posthtml-md')
  const lorem    = require('posthtml-lorem')
  
  const DefaultPosthtmlLoaderOptions = {
    plugins: [
      markdown(),
      lorem()
    ]
  }
  
  return {
    loader: 'posthtml-loader',
    options: Object.assign({}, DefaultPosthtmlLoaderOptions, options, {
      plugins: DefaultPosthtmlLoaderOptions.plugins.concat(options.plugins)
    })
  }
}


function mapNameToLoader(name, options) {
  
  switch(name) {
  case 'js':
  case 'es':
    return {
      test: /\.jsx?$/,
      use: [{
        loader: 'babel-loader',
        options: {
          
        }
      }]
    }

    
  case 'css':
  case 'style':
    options.css = options.css || {}
    options.postcss = options.postcss || {}
    options.css.env = options.postcss.env = env
    
    return {
      test: /\.css$/,
      loader: options.extractPlug.extract({
        failback: 'style-loader'
        ues: [
          cssLoaderOptions(options.css),
          postcssLoaderOptions(options.postcss)
        ]
      }) 
    }
    
  case 'less':
    options.css = options.css || {}
    options.less = options.less || {}
    options.css.env = options.less.env = env

    return {
      test: /\.less$/,
      loader: options.extractPlug.extract({
        failback: 'style-loader'
        ues: [
          cssLoaderOptions(options.css),
          lessLoaderOptions(options.less)
        ]
      })
    }
    
  case 'sass':
  case 'scss':
    options.css = options.css || {}
    options.sass = options.sass || {}
    options.css.env = options.sass.env = env

    return {
      test: /\.{scss|sass}$/,
      loader: options.extractPlug.extract({
        failback: 'style-loader'
        ues: [
          cssLoaderOptions(options.css),
          sassLoaderOptions(options.sass)
        ]
      })
    }

    
  case 'html':
    return {
      test: '/\.html$/',
      loader: options.extractPlug.extract({
        ues: [
          htmlLoaderOptions(options.html),
          postHtmlLoaderOptions(options.posthtml)
        ]
      })
    }


  case 'json':
    return {
      test: '/\.json$/',
      loader: 'json-loader'
    }

  default:
    return name(options)
  }
}


function MakeLoaderOptions(name = 'js', options = {}) {
  let {
    excludeNodeModulesDir,
    includeSourceDir
  } = Object.assign({}, DefaultLoaderOptions, options)
  
  let excludes = mapOptionTypeToProp('exclude', excludeNodeModulesDir)
  let includes = mapOptionTypeToProp('include', excludeNodeModulesDir)

  
  return Object.assign({}, mapNameToLoader(name, options), excludes, includes)
}
