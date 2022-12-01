import { Body, Controller, Get, Inject, Post } from '@midwayjs/decorator'
import { UserService } from '@/service/user.service'
import { BaseController } from '@/controller/base.controller'
import { ResponseResult } from '@/interface'
import { CreateUserDto } from '@/dto/user.dto'
import { Validate } from '@midwayjs/validate'

@Controller('/sys/user')
export class UserController extends BaseController {
  @Inject()
  userService: UserService
  @Get('/list')
  async list(): Promise<ResponseResult> {
    return this.res({ data: await this.userService.list() })
  }
  @Post('/add')
  @Validate()
  async add(@Body() param: CreateUserDto): Promise<ResponseResult> {
    const res = await this.userService.add(param)
    if (!res) {
      return this.res({ code: 10001 })
    }
    return this.res()
  }
}
