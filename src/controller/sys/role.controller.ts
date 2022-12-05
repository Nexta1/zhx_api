import { Body, Controller, Get, Inject, Post } from '@midwayjs/decorator'
import { RoleService } from '@/service/admin/sys/role.service'
import { ResponseResult } from '@/interface'
import { BaseController } from '@/controller/base.controller'
import {
  CreateRoleDto,
  DeleteRoleDto,
  UpdateRoleDto
} from '@/dto/admin/sys/role.dto'
import { Validate } from '@midwayjs/validate'
import { PageSearchDto } from '@/dto/comm.dto'
import { MenuService } from '@/service/admin/sys/menu.service'

@Controller('/sys/role')
export class RoleController extends BaseController {
  @Inject()
  roleService: RoleService
  @Inject()
  menuService: MenuService
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
  async page(@Body() param: PageSearchDto): Promise<ResponseResult> {
    return this.resByPage(
      await this.roleService.page(param.page - 1, param.limit),
      await this.roleService.count(),
      param.page,
      param.limit
    )
  }

  @Post('/update')
  @Validate()
  async update(@Body() param: UpdateRoleDto): Promise<ResponseResult> {
    await this.menuService.refreshOnlineUserPerms()
    return this.res({ data: await this.roleService.update(param) })
  }

  @Post('/delete')
  @Validate()
  async delete(@Body() param: DeleteRoleDto): Promise<ResponseResult> {
    const hasRole = await this.roleService.countRoleByRoleIds(param.roleId)
    console.log(hasRole)
    if (hasRole > 0) {
      return this.res({ code: 10008 })
    }
    await this.roleService.delete(param.roleId)
    await this.menuService.refreshOnlineUserPerms()
    return this.res()
  }
}
