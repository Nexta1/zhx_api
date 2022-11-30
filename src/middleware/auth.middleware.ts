// src/middleware/jwt.middleware

import { Inject, Middleware } from '@midwayjs/decorator'
import { Context, NextFunction } from '@midwayjs/koa'
import { JwtService } from '@midwayjs/jwt'
import { res } from '@/common/utils'
import { ResponseResult } from '@/interface'

@Middleware()
export class AuthMiddleware {
  @Inject()
  jwtService: JwtService

  public static getName(): string {
    return 'jwt'
  }

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      console.log(ctx.url)
      // 判断下有没有校验信息
      if (!ctx.headers['authorization']) {
        this.reject(ctx, { code: 11001 })
        return
      }
      // 从 header 上获取校验信息
      const parts = ctx.get('authorization').trim().split(' ')
      if (parts.length !== 2) {
        this.reject(ctx, { code: 11001 })
        return
      }
      const [scheme, token] = parts
      if (/^Bearer$/i.test(scheme)) {
        try {
          //jwt.verify方法验证token是否有效
          ctx.state.user = await this.jwtService.verify(token, {
            complete: true
          })
        } catch (error) {
          //token过期 生成新的token
          // const newToken = getToken(user)
          //将新token放入Authorization中返回给前端
          // ctx.set('Authorization', newToken)
          this.reject(ctx, { code: 11001 })
          return
        }
        await next()
      }
    }
  }

  // 配置忽略鉴权的路由地址
  ignore(ctx: Context): boolean {
    return (
      ctx.path === '/get_captcha' ||
      ctx.path === '/register' ||
      ctx.path === '/login'
    )
  }

  reject(ctx: Context, op: ResponseResult): void {
    ctx.status = 200
    ctx.body = res(op)
  }
}
