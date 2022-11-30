import { Provide } from '@midwayjs/decorator'
import { InjectEntityModel } from '@midwayjs/typeorm'
import SysRole from '@/entity/sys/role.entity'
import { Repository } from 'typeorm'
import { CreateRoleDto } from '@/dto/admin/sys/role.dto'
import SysRoleMenu from '@/entity/sys/role_menu.entity'
import SysRoleDepartment from '@/entity/sys/role_dept.entity'
import { IAddRoleResult } from '@/service/interface'

@Provide()
export class RoleService {
  @InjectEntityModel(SysRole)
  role: Repository<SysRole>
  @InjectEntityModel(SysRoleMenu)
  roleMenu: Repository<SysRoleMenu>
  @InjectEntityModel(SysRoleDepartment)
  roleDepartment: Repository<SysRoleDepartment>
  /**
   * 查询系统角色
   */
  async list(): Promise<SysRole[]> {
    return await this.role.find()
  }

  async add(param: CreateRoleDto, uid: number): Promise<IAddRoleResult> {
    console.log(uid)
    const { name, label, remark, menus, depts } = param
    const role = await this.role.insert({
      name,
      label,
      remark,
      userId: uid
    })
    console.log(role)
    const { identifiers } = role
    const roleId = parseInt(identifiers[0].id)
    if (menus && menus.length > 0) {
      const insertRows = menus.map(m => {
        return {
          roleId,
          menuId: m
        }
      })
      await this.roleMenu.insert(insertRows)
    }
    if (depts && depts.length > 0) {
      // 关联部门
      const insertRows = depts.map(d => {
        return {
          roleId,
          departmentId: d
        }
      })
      await this.roleDepartment.insert(insertRows)
    }
    return { roleId }
  }
}
