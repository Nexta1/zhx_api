import { Body, Controller, Get, Inject, Post } from '@midwayjs/decorator'
import { MenuService } from '@/service/admin/sys/menu.service'
import { ResponseResult } from '@/interface'
import { BaseController } from '@/controller/base.controller'
import { Validate } from '@midwayjs/validate'
import {
  CreateMenuDto,
  DeleteMenuDto,
  UpdateMenuDto
} from '@/dto/admin/sys/menu.dto'
import { isEmpty } from 'lodash'

@Controller('/sys/menu')
export class MenuController extends BaseController {
  @Inject()
  menuService: MenuService

  @Get('/list')
  async list(): Promise<ResponseResult> {
    return this.res({ data: await this.menuService.list() })
  }

  @Post('/add')
  @Validate()
  async add(@Body() menuDto: CreateMenuDto): Promise<ResponseResult> {
    // 权限必须有ParentId
    if (menuDto.type === 2 && menuDto.parentId === -1) {
      return this.res({ code: 10005 })
    }
    //菜单
    if (menuDto.type === 1 && menuDto.parentId === -1) {
      const parent = await this.menuService.getMenuItemInfo(menuDto.parentId)
      if (isEmpty(parent)) {
        return this.res({ code: 10014 })
      }
      if (parent && parent.type === 1) {
        return this.res({ code: 10006 })
      }
    }
    //目录
    if (menuDto.parentId === -1) {
      menuDto.parentId = undefined
    }
    await this.menuService.save(menuDto)
    return this.res()
  }

  @Post('/update')
  @Validate()
  async update(@Body() menuDto: UpdateMenuDto) {
    // 权限必须有ParentId
    if (menuDto.type === 2 && menuDto.parentId === -1) {
      return this.res({ code: 10005 })
    }
    //菜单
    if (menuDto.type === 1 && menuDto.parentId === -1) {
      const parent = await this.menuService.getMenuItemInfo(menuDto.parentId)
      if (isEmpty(parent)) {
        return this.res({ code: 10014 })
      }
      if (parent && parent.type === 1) {
        return this.res({ code: 10006 })
      }
    }
    //目录
    if (menuDto.parentId === -1) {
      menuDto.parentId = undefined
    }
    await this.menuService.save(menuDto)
    return this.res()
  }

  @Post('/delete')
  @Validate()
  async delete(@Body() param: DeleteMenuDto) {
    const deleteIds = await this.menuService.searchChildMenus(param.menuId)
    await this.menuService.delete(deleteIds)
    return this.res({
      data: deleteIds
    })
  }
}
