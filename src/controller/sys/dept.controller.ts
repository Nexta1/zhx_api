import { Body, Controller, Get, Inject, Post } from '@midwayjs/decorator'
import { ResponseResult } from '@/interface'
import { BaseController } from '@/controller/base.controller'
import { DeptService } from '@/service/admin/sys/dept.service'
import { Validate } from '@midwayjs/validate'
import {
  CreateDeptDto,
  DeleteDeptDto,
  UpdateDeptDto
} from '@/dto/admin/sys/dept.dto'

@Controller('/sys/dept')
export class DeptController extends BaseController {
  @Inject()
  dept: DeptService

  @Get('/list')
  async list(): Promise<ResponseResult> {
    console.log(this.ctx.state.user)
    return this.res({ data: await this.dept.list() })
  }

  @Post('/add')
  @Validate()
  async add(@Body() createDeptDto: CreateDeptDto): Promise<ResponseResult> {
    await this.dept.add(createDeptDto.name, createDeptDto.parentId)
    return this.res()
  }

  @Post('/update')
  @Validate()
  async update(@Body() updateDeptDto: UpdateDeptDto): Promise<ResponseResult> {
    await this.dept.update(updateDeptDto)
    return this.res()
  }

  @Post('/delete')
  @Validate()
  async delete(@Body() deleteDeptDto: DeleteDeptDto) {
    const countChildDept = await this.dept.countChildDept(deleteDeptDto.id)
    const countRoleDept = await this.dept.countRoleDept(deleteDeptDto.id)
    const countUserDept = await this.dept.countUserDept(deleteDeptDto.id)
    if (countChildDept > 0) {
      return this.res({ code: 10015 })
    }
    if (countRoleDept > 0) {
      return this.res({ code: 10010 })
    }
    if (countUserDept > 0) {
      return this.res({ code: 10009 })
    }
    await this.dept.delete(deleteDeptDto.id)
    return this.res()
  }
}
