import { Provide } from '@midwayjs/decorator'
import { InjectEntityModel } from '@midwayjs/typeorm'
import SysDepartment from '@/entity/sys/depts.entity'
import { Repository } from 'typeorm'
import { UpdateDeptDto } from '@/dto/admin/sys/dept.dto'
import SysRoleDepartment from '@/entity/sys/role_dept.entity'
import { UserEntity } from '@/entity/sys/user.entity'

@Provide()
export class DeptService {
  @InjectEntityModel(SysDepartment)
  dept: Repository<SysDepartment>
  @InjectEntityModel(SysRoleDepartment)
  roleDept: Repository<SysRoleDepartment>
  @InjectEntityModel(UserEntity)
  user: Repository<UserEntity>

  /**
   * 获取所有部门
   */
  async list(): Promise<SysDepartment[]> {
    return await this.dept.find()
  }

  /**
   * 新增部门
   * @param deptName
   * @param parentDeptId
   */
  async add(deptName: string, parentDeptId: number): Promise<void> {
    await this.dept.insert({
      name: deptName,
      parentId: parentDeptId === -1 ? undefined : parentDeptId
    })
  }

  /**
   * 更新部门
   * @param param
   */
  async update(param: UpdateDeptDto): Promise<void> {
    await this.dept.update(param.id, {
      parentId: param.parentId === -1 ? undefined : param.parentId,
      name: param.name,
      orderNum: param.orderNum
    })
  }

  /**
   * 删除部门
   * @param departmentId
   */
  async delete(departmentId: number): Promise<void> {
    await this.dept.delete(departmentId)
  }

  async countChildDept(parentId: number) {
    return await this.dept.count({ where: { parentId } })
  }

  async countRoleDept(deptId: number) {
    return await this.roleDept.count({ where: { departmentId: deptId } })
  }

  async countUserDept(deptId: number) {
    return await this.user.count({ where: { departmentId: deptId } })
  }
}
