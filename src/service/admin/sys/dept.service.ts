import { Provide } from '@midwayjs/decorator'
import { InjectEntityModel } from '@midwayjs/typeorm'
import SysDepartment from '@/entity/sys/depts.entity'
import { Repository } from 'typeorm'

@Provide()
export class DeptService {
  @InjectEntityModel(SysDepartment)
  dept: Repository<SysDepartment>
  async list(): Promise<SysDepartment[]> {
    return await this.dept.find()
  }
  async add(deptName: string, parentDeptId: number): Promise<void> {
    await this.dept.insert({
      name: deptName,
      parentId: parentDeptId === -1 ? undefined : parentDeptId
    })
  }
}
