import { Body, Controller, Get, Inject, Post } from '@midwayjs/decorator'
import { OnlineService } from '@/service/admin/sys/online.service'
import { BaseController } from '@/controller/base.controller'
import { Validate } from '@midwayjs/validate'
import { KickDto } from '@/dto/admin/sys/online.dto'
import { UserService } from '@/service/admin/sys/user.service'

@Controller('/sys/online')
export class OnlineController extends BaseController {
  @Inject()
  onlineService: OnlineService
  @Inject()
  userService: UserService
  @Get('/list')
  async list() {
    return this.res({ data: await this.onlineService.list() })
  }
  @Post('/kick')
  @Validate()
  async kick(@Body() dto: KickDto) {
    if (dto.id === this.ctx.admin.uid) {
      return this.res({ code: 10012 })
    }
    await this.userService.forbidden(dto.id)
    return this.res()
  }
}
