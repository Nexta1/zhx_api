// src/controller/home.ts
import { Body, Controller, Get, Inject, Post } from '@midwayjs/decorator'
import { Validate } from '@midwayjs/validate'
import { LoginInfoDto, UserDTO } from '@/dto/admin/sys/user.dto'
import { UserService } from '@/service/admin/sys/user.service'
import { BaseController } from '@/controller/base.controller'
import { VerifyService } from '@/service/admin/common/verify.service'
import { isEmpty } from 'lodash'
import { ResponseResult } from '@/interface'

@Controller('/')
export class LoginController extends BaseController {
  @Inject()
  userService: UserService
  @Inject()
  verifyService: VerifyService

  @Post('/register')
  @Validate()
  async createUser(@Body() user: UserDTO) {
    const res = await this.userService.register(user)
    return this.handle(res)
  }

  @Get('/get_captcha')
  async captchaByImg(): Promise<ResponseResult> {
    const result = await this.verifyService.getImageCaptcha()
    return this.res({ data: result })
  }

  @Post('/login')
  @Validate()
  async login(@Body() loginInfo: LoginInfoDto): Promise<ResponseResult> {
    const isSuccess = await this.verifyService.checkImgCaptcha(
      loginInfo.captchaId,
      loginInfo.verifyCode
    )
    if (!isSuccess) {
      return this.res({ code: 1002 })
    }
    const { password, username } = loginInfo
    const res = await this.verifyService.getLoginSign(username, password)

    if (isEmpty(res)) {
      return this.res({ code: 10003 })
    }
    return this.res({ data: { token: res } })
  }
}
