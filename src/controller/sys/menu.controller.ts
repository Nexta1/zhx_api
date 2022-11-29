import { Controller, Inject, Post, Body, Get } from '@midwayjs/decorator'
import { MenuService } from '@/service/admin/sys/menu.service'
import { ResponseResult } from '@/interface'
import { BaseController } from '@/controller/base.controller'
import { Validate } from '@midwayjs/validate'
import { CreateMenuDto } from '@/dto/admin/sys/menu.dto'
@Controller('/sys/menu')
export class MenuController extends BaseController {
  @Inject()
  menu: MenuService
  @Get('/list')
  async list(): Promise<ResponseResult> {
    return this.res({ data: await this.menu.list() })
  }
  @Post('/add')
  @Validate()
  async add(@Body() menuDto: CreateMenuDto): Promise<ResponseResult> {
    await this.menu.save(menuDto)
    return this.res()
  }
}
