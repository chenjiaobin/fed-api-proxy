const path = require('path')
const log4js = require('log4js')
const isProd = process.env.NODE_ENV === 'production'

module.exports = function register(opts) {

  if (!opts.dir) {
    throw new Error('dir is been omitted!')
  }

  if (!opts.project) {
    throw new Error('project is been omitted!')
  }

  const { dir, project } = opts
  
  const appenders = {
    cheese: {
      type: 'dateFile',
      filename: path.join(dir, project),
      pattern: '.log.yyyyMMdd',
      alwaysIncludePattern: true
    },
    error: {
      type: 'dateFile',
      filename: path.join(dir, `${project}-error`),
      pattern: '.log.yyyyMMdd',
      alwaysIncludePattern: true
    },
    out: { type: isProd ? 'stdout' : 'console' }
  }

  log4js.configure({
    appenders,
    categories: {
      default: {
        appenders: ['out'],
        level: 'info'
      },
      cheese: {
        appenders: ['cheese'],
        level: 'debug'
      },
      error: {
        appenders: ['error'],
        level: 'error'
      }
    },
    pm2: isProd,
    pm2InstanceVar: project.toUpperCase()
  })

  const logger = log4js.getLogger('cheese')
  const errorLogger = log4js.getLogger('error')

  return {
    log(message, method = 'info') {
      try {
        logger[method](JSON.stringify(message))
      } catch (error) {
        this.error(error)
      }
    },
    error(message, method = 'error') {
      errorLogger[method](JSON.stringify(message))
    }
  }
}
