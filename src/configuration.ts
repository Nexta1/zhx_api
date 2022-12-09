import { App, Configuration, Inject } from '@midwayjs/decorator'
import * as koa from '@midwayjs/koa'
import * as validate from '@midwayjs/validate'
import * as info from '@midwayjs/info'
import * as orm from '@midwayjs/typeorm'
import { join } from 'path'
import { DefaultErrorFilter } from './filter/default.filter'
import { NotFoundFilter } from './filter/notfound.filter'
import * as cache from '@midwayjs/cache'
import * as swagger from '@midwayjs/swagger'
import * as upload from '@midwayjs/upload'
import * as jwt from '@midwayjs/jwt'
import * as passport from '@midwayjs/passport'
import * as i18n from '@midwayjs/i18n'
import * as redis from '@midwayjs/redis'
import * as bull from '@midwayjs/bull'
// eslint-disable-next-line node/no-unpublished-import
import 'tsconfig-paths/register'
import * as captcha from '@midwayjs/captcha'
import { AuthMiddleware } from '@/middleware/auth.middleware'
import * as bullBoard from '@midwayjs/bull-board'
@Configuration({
  imports: [
    koa,
    validate,
    swagger,
    upload,
    orm,
    jwt,
    passport,
    i18n,
    redis,
    captcha,
    cache,
    bull,
    bullBoard,
    {
      component: info,
      enabledEnvironment: ['local']
    }
  ],
  importConfigs: [join(__dirname, './config')]
})
export class ContainerLifeCycle {
  @Inject()
  bullFramework: bull.Framework
  @App()
  app: koa.Application

  async onReady(): Promise<void> {
    // add middleware
    this.app.useMiddleware([AuthMiddleware])
    // add filter
    this.app.useFilter([NotFoundFilter, DefaultErrorFilter])
  }
}
