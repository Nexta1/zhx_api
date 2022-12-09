import { Body, Controller, Get, Inject } from '@midwayjs/decorator'
import { TaskService } from '@/service/admin/sys/task.service'
import { BaseController } from '@/controller/base.controller'
import { PageSearchDto } from '@/dto/page.dto'

@Controller('/sys/task')
export class TaskController extends BaseController {
  @Inject()
  taskService: TaskService
  @Get('/page')
  async page(@Body() param: PageSearchDto) {
    return this.res({
      data: await this.taskService.page(param.page, param.limit)
    })
  }
}
