import { Controller, Get, Inject } from '@midwayjs/decorator'
import { OnlineService } from '@/service/admin/sys/online.service'
import { BaseController } from '@/controller/base.controller'

@Controller('/sys/online')
export class OnlineController extends BaseController {
  @Inject()
  onlineService: OnlineService
  @Get('/list')
  async list() {
    return this.res({ data: await this.onlineService.list() })
  }
}
