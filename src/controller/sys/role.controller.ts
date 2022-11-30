import { Body, Controller, Get, Inject, Post } from '@midwayjs/decorator'
import { RoleService } from '@/service/admin/sys/role.service'
import { ResponseResult } from '@/interface'
import { BaseController } from '@/controller/base.controller'
import { CreateRoleDto } from '@/dto/admin/sys/role.dto'

@Controller('/sys/role')
export class RoleController extends BaseController {
  @Inject()
  roleService: RoleService
  @Get('/list')
  async list(): Promise<ResponseResult> {
    return this.res({ data: await this.roleService.list() })
  }
  @Post('/add')
  async add(@Body() dto: CreateRoleDto): Promise<ResponseResult> {
    const res = await this.roleService.add(dto, this.ctx.state.user.payload.uid)
    return this.res({ data: res })
  }
}
