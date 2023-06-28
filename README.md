# node-router-rigister
用于在Node中注册路由并转发接口请求到服务端Api

# 功能
1. node router的注册，并生成路由执行函数，转发前端接口
2. 提供单个接口参数前置处理、返回数据处理和参数校验钩子
3. log4j日志记录
4. axios请求参数

# 使用
该项目没有发npm包，因此可以pull到本地，通过软连接的方式使用，也可以放到自己的仓库，然后通过npm安装到依赖里面


```
// package.json

"dependencies": {
    "@chenjb/router-register": "git+http://账号:密码@github.com/node-router-register.git",
}

```
项目使用
```
const register = require('@lrts/router-register')
// axios.create创建的实例
const axios = require('../plugins/axios')
// api映射文件
const api = require('../service/api')

const ajax = register(new Router(), {
  axios,
  logger: {
    dir: '/data/logs/fed',
    project: '项目名称'
  },
  map: api,
  requestType: 'body'
})

router.use('/ajax/', ajax.routes(), ajax.allowedMethods())

```
api映射文件
```
const api = {
  apiA: {
    path: '/a/b',
    method: 'post',
    requestType: 'formData'
  },
  login: {
    path: '/login/pwd',
    method: 'post',
    afterHook: (ctx, data) => {
      if (data.status === 0) {
        setCookies(ctx, {
          sid: data.data.token
        })
      }
      return data
    }
  }
}

module.exports = api
```