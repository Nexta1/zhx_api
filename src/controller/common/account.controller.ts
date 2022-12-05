import { Body, Controller, Get, Inject, Post } from '@midwayjs/decorator'
import { VerifyService } from '@/service/admin/common/verify.service'
import { ResponseResult } from '@/interface'
import { BaseController } from '@/controller/base.controller'
import { Validate } from '@midwayjs/validate'
import {
  UpdatePasswordDto,
  UpdatePersonInfoDto
} from '@/dto/admin/sys/user.dto'
import { UserService } from '@/service/admin/sys/user.service'

@Controller('/account')
export class AccountController extends BaseController {
  @Inject()
  verifyService: VerifyService
  @Inject()
  userService: UserService

  @Get('/perms')
  async getPerms(): Promise<ResponseResult> {
    return this.res({
      data: await this.verifyService.getPermsByUid(this.uid())
    })
  }

  @Get('/info')
  async info() {
    return this.res({ data: await this.userService.info({ id: this.uid() }) })
  }

  @Post('/update')
  async update(@Body() dto: UpdatePersonInfoDto) {
    return this.res({
      data: await this.userService.updatePersonInfo(this.uid(), dto)
    })
  }

  @Post('/password')
  @Validate()
  async updatePassword(@Body() dto: UpdatePasswordDto) {
    const res = this.userService.updatePassword(this.uid(), dto)
    if (res) {
      return this.res()
    } else {
      return this.res({ code: 10011 })
    }
  }
}
