import { Body, Controller, Inject, Post } from '@midwayjs/decorator'
import { LoginLogService } from '@/service/admin/common/login_log.service'
import { PageSearchDto } from '@/dto/page.dto'
import { BaseController } from '@/controller/base.controller'

@Controller('/sys/log')
export class LogController extends BaseController {
  @Inject()
  loginLog: LoginLogService

  @Post('/login/page')
  async loginPage(@Body() dto: PageSearchDto) {
    const res = await this.loginLog.page(dto.page - 1, dto.limit)
    const count = await this.loginLog.count()
    return this.resByPage(res, count, dto.page, dto.limit)
  }
}
