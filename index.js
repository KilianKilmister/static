'use strict'
const EventEmitter = require('events')

class Static extends EventEmitter {
  description () {
    return 'Serves static files.'
  }
  optionDefinitions () {
    return [
      {
        name: 'directory',
        alias: 'd',
        type: String,
        typeLabel: '[underline]{path}',
        description: 'Root directory, defaults to the current directory.'
      },
      {
        name: 'static.maxage', type: Number, description: 'Browser cache max-age in milliseconds.'
      },
      {
        name: 'static.defer', type: Boolean, description: 'If true, serves after `yield next`, allowing any downstream middleware to respond first.'
      },
      {
        name: 'static.index',
        type: String,
        typeLabel: '[underline]{path}',
        description: 'Default file name, defaults to `index.html`.'
      }
    ]
  }
  middleware (options) {
    options = options || {}
    const directory = options.directory || process.cwd()
    const staticOptions = { hidden: true }
    if (options.staticDefer) staticOptions.defer = options.staticDefer
    if (options.staticMaxage) staticOptions.maxage = options.staticMaxage
    if (options.staticIndex) staticOptions.index = options.staticIndex
    if (directory) {
      const serve = require('koa-static')
      staticOptions.root = directory
      this.emit('start', staticOptions)
      return serve(directory, staticOptions)
    }
  }
}

module.exports = Static