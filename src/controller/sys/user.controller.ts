import { Body, Controller, Get, Inject, Post } from '@midwayjs/decorator'
import { UserService } from '@/service/admin/sys/user.service'
import { BaseController } from '@/controller/base.controller'
import { ResponseResult } from '@/interface'
import {
  CreateUserDto,
  DeleteUserDto,
  PageUserDto,
  PasswordUserDto,
  TransferUserDto,
  UpdateUserDto
} from '@/dto/admin/sys/user.dto'
import { Validate } from '@midwayjs/validate'
import { MenuService } from '@/service/admin/sys/menu.service'

@Controller('/sys/user')
export class UserController extends BaseController {
  @Inject()
  userService: UserService
  @Inject()
  menuService: MenuService
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
  @Post('/page')
  @Validate()
  async page(@Body() dto: PageUserDto): Promise<ResponseResult> {
    const list = await this.userService.page(
      this.uid(),
      dto.departmentIds,
      dto.page - 1,
      dto.limit
    )
    const total = await this.userService.count(dto.departmentIds)
    return this.resByPage(list, total, dto.page, dto.limit)
  }
  @Post('/transfer')
  @Validate()
  async transfer(@Body() param: TransferUserDto): Promise<ResponseResult> {
    const { userIds, departmentId } = param
    await this.userService.transfer(userIds, departmentId)
    return this.res()
  }
  @Post('/update')
  @Validate()
  async update(@Body() param: UpdateUserDto): Promise<ResponseResult> {
    await this.userService.update(param)
    await this.menuService.refreshPerms(param.id)
    return this.res()
  }
  @Post('/password')
  @Validate()
  async updatePassword(@Body() dto: PasswordUserDto) {
    await this.userService.forceUpdatePassword(dto.userId, dto.password)
    return this.res()
  }
  @Post('/delete')
  @Validate()
  async delete(@Body() param: DeleteUserDto): Promise<ResponseResult> {
    await this.userService.delete(param.id)
    return this.res()
  }
}
