import { Body, Controller, Get, Inject, Post } from '@midwayjs/decorator'
import { RoleService } from '@/service/admin/sys/role.service'
import { ResponseResult } from '@/interface'
import { BaseController } from '@/controller/base.controller'
import { CreateRoleDto } from '@/dto/admin/sys/role.dto'
import { Validate } from '@midwayjs/validate'
import { PageSearchDto } from '@/dto/comm.dto'

@Controller('/sys/role')
export class RoleController extends BaseController {
  @Inject()
  roleService: RoleService
  @Get('/list')
  async list(): Promise<ResponseResult> {
    return this.res({ data: await this.roleService.list() })
  }
  @Post('/add')
  @Validate()
  async add(@Body() dto: CreateRoleDto): Promise<ResponseResult> {
    const res = await this.roleService.add(dto, this.ctx.state.user.payload.uid)
    return this.res({ data: res })
  }
  @Post('/page')
  @Validate()
  async page(@Body() param: PageSearchDto) {
    return this.resByPage(
      await this.roleService.page(param.page - 1, param.limit),
      await this.roleService.count(),
      param.page,
      param.limit
    )
  }
}
