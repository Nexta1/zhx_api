import { Body, Controller, Inject, Post } from '@midwayjs/decorator'
import { ResponseResult } from '@/interface'
import { BaseController } from '@/controller/base.controller'
import { DeptService } from '@/service/admin/sys/dept.service'
import { Validate } from '@midwayjs/validate'
import { CreateDeptDto } from '@/dto/admin/sys/dept.dto'

@Controller('/sys/dept')
export class DeptController extends BaseController {
  @Inject()
  dept: DeptService
  @Post('/list')
  async list(): Promise<ResponseResult> {
    return this.res({ data: await this.dept.list() })
  }
  @Post('/add')
  @Validate()
  async add(@Body() createDeptDto: CreateDeptDto): Promise<ResponseResult> {
    await this.dept.add(createDeptDto.name, createDeptDto.parentId)
    return this.res()
  }
}
