import { App, Configuration } from '@midwayjs/decorator'
import * as koa from '@midwayjs/koa'
import * as validate from '@midwayjs/validate'
import * as info from '@midwayjs/info'
import * as orm from '@midwayjs/typeorm'
import { join } from 'path'
import { DefaultErrorFilter } from './filter/default.filter'
import { NotFoundFilter } from './filter/notfound.filter'

import * as swagger from '@midwayjs/swagger'
import * as upload from '@midwayjs/upload'
import * as jwt from '@midwayjs/jwt'
import * as passport from '@midwayjs/passport'
import * as i18n from '@midwayjs/i18n'
import * as redis from '@midwayjs/redis'
// eslint-disable-next-line node/no-unpublished-import
import 'tsconfig-paths/register'
import * as captcha from '@midwayjs/captcha'
import { AuthMiddleware } from '@/middleware/auth.middleware'

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
    {
      component: info,
      enabledEnvironment: ['local']
    }
  ],
  importConfigs: [join(__dirname, './config')]
})
export class ContainerLifeCycle {
  @App()
  app: koa.Application

  async onReady() {
    // add middleware
    this.app.useMiddleware([AuthMiddleware])
    // add filter
    this.app.useFilter([NotFoundFilter, DefaultErrorFilter])
  }
}
