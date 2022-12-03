// src/middleware/jwt.middleware

import { Inject, Middleware } from '@midwayjs/decorator'
import { Context, NextFunction } from '@midwayjs/koa'
import { JwtService } from '@midwayjs/jwt'
import { res } from '@/common/utils'
import { ResponseResult } from '@/interface'
import { RedisService } from '@midwayjs/redis'

@Middleware()
export class AuthMiddleware {
  @Inject()
  jwtService: JwtService
  @Inject()
  redisService: RedisService

  public static getName(): string {
    return 'jwt'
  }

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const path = ctx.url.split('?')[0]
      console.log(path)
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
          return this.reject(ctx, { code: 11001 })
        }
        // const perms = await this.redisService.get(
        //   'admin:perms:' + ctx.state.user.payload.uid
        // )
        //
        // if (!isEmpty(perms)) {
        //   return this.reject(ctx, { code: 11001 })
        // }
        // const permsArray = JSON.parse(perms).map(r => r.replace(/:/g, '/'))
        // if (!permsArray.includes(path)) {
        //   return this.reject(ctx, { code: 11003 })
        // }
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
