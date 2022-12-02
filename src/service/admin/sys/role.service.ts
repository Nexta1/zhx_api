import { Config, Inject, Provide } from '@midwayjs/decorator'
import { InjectEntityModel } from '@midwayjs/typeorm'
import SysRole from '@/entity/sys/role.entity'
import { Not, Repository } from 'typeorm'
import { CreateRoleDto, UpdateRoleDto } from '@/dto/admin/sys/role.dto'
import SysRoleMenu from '@/entity/sys/role_menu.entity'
import SysRoleDepartment from '@/entity/sys/role_dept.entity'
import { IAddRoleResult } from '@/service/interface'
import SysUserRole from '@/entity/sys/user_role.entity'
import { Utils } from '@/common/utils'

import { BaseService } from '@/service/base.service'
import { difference, filter, includes, map } from 'lodash'

@Provide()
export class RoleService extends BaseService {
  @InjectEntityModel(SysRole)
  roleModel: Repository<SysRole>
  @InjectEntityModel(SysRoleMenu)
  roleMenu: Repository<SysRoleMenu>
  @InjectEntityModel(SysRoleDepartment)
  roleDepartment: Repository<SysRoleDepartment>
  @InjectEntityModel(SysUserRole)
  userRole: Repository<SysUserRole>
  @Inject()
  utils: Utils
  @Config('superRoleId')
  superRoleId: number
  /**
   * 查询系统角色
   */
  async list(): Promise<SysRole[]> {
    return await this.roleModel.find()
  }
  /**
   * 增加系统角色
   * @param param
   * @param uid
   */
  async add(param: CreateRoleDto, uid: number): Promise<IAddRoleResult> {
    console.log(uid)
    const { name, label, remark, menus, depts } = param
    const role = await this.roleModel.insert({
      name,
      label,
      remark,
      userId: uid
    })
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

  /**
   * 通过uid查询角色id
   * @param uid
   */
  async getRoleIdByUid(uid: number): Promise<number[]> {
    const result = await this.userRole.find({ where: { userId: uid } })
    if (!this.utils.isEmpty(result)) {
      return result.map(v => v.roleId)
    }
    return []
  }

  /**
   * 分頁查詢
   * @param page
   * @param count
   */
  async page(page: number, count: number) {
    return await this.roleModel.find({
      where: {
        id: Not(this.superRoleId)
      },
      order: {
        id: 'ASC'
      },
      take: count,
      skip: page * count
    })
  }

  /**
   * 獲取除了超級管理員的數量
   */
  async count(): Promise<number> {
    return await this.roleModel.count({ where: { id: Not(this.superRoleId) } })
  }
  async update(param: UpdateRoleDto) {
    const { roleId, name, label, remark, menus, depts } = param
    const role = await this.roleModel.save({ id: roleId, name, label, remark })
    const originDeptRows = await this.roleDepartment.find({ where: { roleId } })
    const originMenuRows = await this.roleMenu.find({ where: { roleId } })
    const originMenuIds = originMenuRows.map(e => {
      return e.menuId
    })
    const originDeptIds = originDeptRows.map(e => {
      return e.departmentId
    })
    const insertMenuRowIds = difference(menus, originMenuIds)
    const deleteMenuRowIds = difference(originMenuIds, menus)
    const insertDeptIds = difference(depts, originDeptIds)
    const deleteDeptIds = difference(originDeptIds, depts)
    await this.getManager().transaction(async manager => {
      if (insertMenuRowIds.length > 0) {
        const insertRows = map(insertMenuRowIds, menuId => {
          return {
            roleId,
            menuId
          }
        })
        await manager
          .getRepository(SysRoleMenu)
          .createQueryBuilder('role_menu')
          .insert()
          .values(insertRows)
          .execute()
      }
      //todo
    //   if (deleteMenuRowIds.length > 0) {
    //     const deleteRows = filter(originMenuRows, e => {
    //       includes(deleteMenuRowIds, e.menuId)
    //     }).map(r => r.id)
    //   }
    // })
  }
}
