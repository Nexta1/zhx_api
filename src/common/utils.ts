import * as CryptoJS from 'crypto-js'
import { Config, Inject, Provide, Scope, ScopeEnum } from '@midwayjs/decorator'
import { customAlphabet, nanoid } from 'nanoid'
import { JwtService } from '@midwayjs/jwt'
import { ResponseResult } from '@/interface'
import { RESCODE } from '@/constant/global'
import BaseErrorCode from '@/exception/base.error'
import SystemErrorCode from '@/exception/system.error'
import { isEmpty } from 'lodash'
export function res(op?: ResponseResult): ResponseResult {
  return {
    data: op?.data ?? null,
    code: op?.code ?? RESCODE.SUCCESS,
    message: op?.code
      ? errorMessage(op!.code) || op?.message || 'unknown error'
      : op?.message || 'success'
  }
}
export function resByPage<V>(
  list: V,
  total: number,
  page: number,
  size: number
): ResponseResult {
  return res({
    data: {
      list,
      pagination: {
        total,
        page,
        size
      }
    }
  })
}

/**
 * 根据code获取错误信息
 */
export function errorMessage(code: number): string {
  let errorCode = BaseErrorCode[code]
  if (!errorCode) {
    errorCode = SystemErrorCode[code]
  }
  // todo
  return errorCode
}

@Provide()
@Scope(ScopeEnum.Singleton)
export class Utils {
  @Config('jwt')
  jwt
  @Inject()
  jwtService: JwtService

  // getReqIp(ctx: Context) {
  //   const req = ctx.req
  //   return (
  //     req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
  //     req.connection.remoteAddress || // 判断 connection 的远程 IP
  //     req.socket.remoteAddress
  //   ) // 判断后端的 socket 的 IP
  //     .replace('::ffff:', '')
  // }
  /**
   * AES加密
   */
  aesEncrypt(msg: string, secret: string): string {
    return CryptoJS.AES.encrypt(msg, secret).toString()
  }

  /**
   * AES解密
   */
  aesDecrypt(encrypted: string, secret: string): string {
    return CryptoJS.AES.decrypt(encrypted, secret).toString(CryptoJS.enc.Utf8)
  }

  /**
   * md5加密
   */
  md5(msg: string): string {
    return CryptoJS.MD5(msg).toString()
  }

  /**
   * 生成一个UUID
   */
  generateUUID(): string {
    return nanoid()
  }

  /**
   * 生成一个随机的值
   */
  generateRandomValue(
    length: number,
    placeholder = '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'
  ): string {
    const customNanoid = customAlphabet(placeholder, length)
    return customNanoid()
  }
  /**
   * JsonWebToken Sign
   * https://github.com/auth0/node-jsonwebtoken
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  jwtSign(sign: any, options?: any): string {
    return this.jwtService.signSync(sign, this.jwt.secret, options)
  }
  //
  // /**
  //  * JsonWebToken Verify
  //  * https://github.com/auth0/node-jsonwebtoken
  //  */
  // // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  jwtVerify(token: string, options?: any): any {
    return this.jwtService.signSync(token, this.jwt.secret, options)
  }

  /**
   * 数组去重
   * @param arr
   */
  uniqueArray(arr) {
    return Array.from(new Set(arr))
  }

  /**
   * 判断为空
   * @param param
   */
  isEmpty(param) {
    return isEmpty(param)
  }
}
