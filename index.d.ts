import { Context } from 'koa'
import Router from '@koa/router'
import { AxiosInstance } from 'axios'

export = register

declare function register<T, U>(router: Router<T, U>, options: register.Options): void

declare namespace register {

  type BaseOptions = {
    /** 请求方法 */
    method: 'get' | 'post'
    /** 请求参数 */
    params: Object
    /** 请求地址 */
    url: string
    /** 校验钩子 */
    validateHook: (ctx: Context, params: Object) => {
      isValid: boolean
      res?: Object
    }
    /** 前置钩子 */
    beforeHook: (ctx: Context, params: Object) => Object
    /** 后置钩子 */
    afterHook: (ctx: Context, params: Object) => void
    /** 转换返回数据钩子 */
    transferResponse: (data: Object) => Object
  }

  interface MapOptions extends Partial<BaseOptions> {
    /** 转发路径 */
    path: string
  }

  interface LogOptions {
    /** 日志目录 */
    dir: string
    /** 项目名称 */
    project: string
  }

  /**
   * configration options.
   */
  interface Options {
    /** axios实例 */
    axios: AxiosInstance
    /** logger实例 */
    logger?: register.LogOptions,
    /** 接口映射 */
    map?: {
      [key: string]: register.MapOptions
    }
  }
}
