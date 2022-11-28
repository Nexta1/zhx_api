import { Utils } from '@/common/utils'
import { Inject } from '@midwayjs/decorator'
import { ResponseResult } from '@/interface'
import { RESCODE } from '@/constant/global'
import BaseErrorCode from '@/exception/base.error'
import SystemErrorCode from '@/exception/system.error'

export class BaseController {
  @Inject()
  utils: Utils

  /**
   * 响应成功
   * @param data
   * @param message
   */
  ok(data?: any, message?: string): ResponseResult {
    return this.res({
      message: message ? message : '操作成功',
      data: data ? data : null,
      code: RESCODE.SUCCESS
    })
  }

  /**
   * 响应失败
   * @param message
   * @param code
   */
  fail(message?: string, code?: number): ResponseResult {
    return this.res({ data: null, message: message, code: code })
  }

  /**
   * 操作
   * @param data
   * @param message
   */
  handle(data: boolean, message?: string): ResponseResult {
    return this.res({
      message: message ? message : data ? '操作成功' : '操作失败',
      data: data ? data : null,
      code: data ? RESCODE.SUCCESS : RESCODE.HANDLE_FAIL
    })
  }

  /**
   * 响应体
   * @param op
   */
  res(op?: ResponseResult): ResponseResult {
    return {
      data: op?.data ?? null,
      code: op?.code ?? RESCODE.SUCCESS,
      message: op?.code
        ? this.errorMessage(op!.code) || op?.message || 'unknown error'
        : op?.message || 'success'
    }
  }

  /**
   * ❌
   * @param code
   */
  errorMessage(code: number): string {
    let errorCode = BaseErrorCode[code]
    if (!errorCode) {
      errorCode = SystemErrorCode[code]
    }
    // todo
    return errorCode
  }
}
