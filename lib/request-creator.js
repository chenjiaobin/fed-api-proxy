const qs = require('qs')
const getClientIp = require('./ip')
const getResponse = require('./get-data')

// 生成axios配置
function createAxiosConfig(ctx, base) {
  const { url, method, requestType, beforeHook, host } = base
  const params = beforeHook(ctx, base.params)

  const config = {
    url,
    method,
    headers: {
      'user-agent': ctx.req.headers['user-agent'],
      cookie: ctx.req.headers.cookie ? ctx.req.headers.cookie : ''
    }
  }

  if (!params.clientIp && (ip = getClientIp(ctx.request))) {
    params.clientIp = ip
  }
  if (method === 'get') {
    config.params = params
  }
  if (method === 'post') {
    config.data = params
    if (requestType === 'formData') {
      config.transformRequest = [(data) => qs.stringify(data)]
    } else {
      if (ctx.req.headers['content-type']) {
        config.headers["content-type"] = ctx.req.headers['content-type']
      }
    }
  }
  if (host) {
    config.url = `${host}${config.url}`
  }
  return config
}

module.exports = function createRequest(axios, logger) {
  return async function request(ctx, axiosParams) {
    const { method, params, afterHook, transferResponse } = axiosParams
    const config = createAxiosConfig(ctx, axiosParams)
  
    const start = Date.now()
    const result = await axios(config)
    const logType = (result.data && result.data.status === 0) ? 'info' : 'error'
    const spendTime = Date.now() - start
    const info = result.data || (result.response && result.response.data) || { status: null, msg: result.message }
    const data = getResponse(info, axios.defaults && axios.defaults.responseType || 'json')
  
    // 日志记录
    if (logger) {
      process.nextTick(() => {
        const { headers, url, baseURL } = result.config
        logger({
          method,
          url: baseURL + url,
          headers,
          spendTime: `${spendTime}ms`,
          params,
          data: { status: data.status, msg: data.msg }
        }, logType)
      })
    }
  
    afterHook(ctx, data)
  
    return transferResponse(data)
  }
}
