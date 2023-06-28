// 默认参数校验函数
function defaultValidator() {
  return {
    isValid: true
  }
}

// 默认请求结果转换
function defaultTransfer(data) {
  return data
}

// 默认参数前置处理钩子
function defaultBeforeHook(ctx, params) {
  return params
}

// 默认返回数据后置处理钩子
function defaultAfterHook(ctx, data) {
  return data
}

module.exports = function createController(request) {
  return function getController(config) {

    const {
      path: url,
      method = 'get',
      host = '',
      requestType = 'body', // post 请求方式，body、formData
      beforeHook = defaultBeforeHook,
      afterHook = defaultAfterHook,
      validateHook = defaultValidator,
      transferResponse = defaultTransfer
    } = config

    return async function(ctx, next) {

      const params = method === 'get' ? ctx.request.query : ctx.request.body

      const { isValid, res } = validateHook(ctx, params)

      if (isValid !== true) {
        ctx.body = res || {
          status: 500,
          msg: '参数校验失败'
        }
      } else {
        ctx.body = await request(ctx, {
          url,
          method,
          host,
          requestType,
          params,
          afterHook,
          beforeHook,
          transferResponse
        })
      }
    }
  }
}
