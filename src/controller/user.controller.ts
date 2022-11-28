// src/controller/home.ts
import { Body, Controller, Inject, Post } from '@midwayjs/decorator'
import { Validate } from '@midwayjs/validate'
import { LoginInfoDto, UserDTO } from '@/dto/user.dto'
import { UserService } from '@/service/user.service'
import { BaseController } from '@/controller/base.controller'

@Controller('/')
export class UserController extends BaseController {
  @Inject()
  userService: UserService

  @Post('/')
  @Validate()
  async createUser(@Body() user: UserDTO) {
    const res = await this.userService.createUser(user)
    return this.handle(res)
  }

  @Post('/login')
  @Validate()
  async login(@Body() user: LoginInfoDto) {
    // const res = await this.userService
  }
}
