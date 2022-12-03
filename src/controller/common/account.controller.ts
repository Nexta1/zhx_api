import { Controller, Get, Inject } from '@midwayjs/decorator'
import { VerifyService } from '@/service/admin/common/verify.service'
import { ResponseResult } from '@/interface'
import { BaseController } from '@/controller/base.controller'

@Controller('/account')
export class AccountController extends BaseController {
  @Inject()
  verifyService: VerifyService

  @Get('/perms')
  async getPerms(): Promise<ResponseResult> {
    return this.res({
      data: await this.verifyService.getPermsByUid(this.uid())
    })
  }
}
