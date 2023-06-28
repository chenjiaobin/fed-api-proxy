const createRequest = require('./request-creator')
const createController = require('./controller-creator')
const loggerRegister = require('./log')

module.exports = function register(router, opts = {}) {
  if (!opts.axios) {
    throw new Error('axios is been omitted!')
  }
  // 代理接口集合
  const map = opts.map || {}
  const requestType = opts.requestType || ''
  // log4j日志
  const { log } = opts.logger ? loggerRegister({
    dir: opts.logger.logDir,
    project: opts.logger.project
  }) : {}
  // 创建请求
  const request = createRequest(opts.axios, log)
  // 发起请求
  const getController = createController(request)

  // 生成node router
  Object.keys(map).forEach(key => {
    const config = map[key]
    if (!config.requestType && requestType) {
      config.requestType = requestType
    }
    const { method = 'get' } = config
    router[method](key, getController(config))
  })

  return router
}
