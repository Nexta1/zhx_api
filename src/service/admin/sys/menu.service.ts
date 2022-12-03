import { InjectEntityModel } from '@midwayjs/typeorm'
import SysMenu from '@/entity/sys/menu.entity'
import { IsNull, Not, Repository } from 'typeorm'
import { CreateMenuDto } from '@/dto/admin/sys/menu.dto'
import { Config, Inject, Provide } from '@midwayjs/decorator'
import { RoleService } from '@/service/admin/sys/role.service'
import { concat, includes, isEmpty, uniq } from 'lodash'

@Provide()
export class MenuService {
  @InjectEntityModel(SysMenu)
  menuModel: Repository<SysMenu>
  @Inject()
  roleService: RoleService
  @Config('superRoleId')
  superRoleId: number

  /**
   * 获取所有菜单
   */
  async list(): Promise<SysMenu[]> {
    return await this.menuModel.find()
  }

  /**
   * 保存更新
   * @param menu
   */
  async save(menu: CreateMenuDto): Promise<CreateMenuDto> {
    return await this.menuModel.save(menu)
  }

  /**
   * id获取某个菜单信息
   * @param mid
   */
  async getMenuItemInfo(mid: number): Promise<SysMenu> {
    return await this.menuModel.findOne({ where: { id: mid } })
  }

  /**
   * 根据uid获取菜单
   * @param uid
   */
  async getMenusByUid(uid: number): Promise<SysMenu[]> {
    const roleIds = await this.roleService.getRoleIdByUid(uid)
    let menus: SysMenu[] = []
    //超级管理员
    if (includes(roleIds, this.superRoleId)) {
      menus = await this.menuModel.find()
    } else {
      if (!isEmpty(roleIds)) {
        menus = await this.menuModel
          .createQueryBuilder('menu')
          .innerJoinAndSelect(
            'sys_role_menu',
            'role_menu',
            'role_menu.role_id IN (:...roleIds)',
            { roleIds }
          )
          .andWhere('menu.id=role_menu.id')
          .getMany()
      }
    }
    return menus
  }

  /**
   * 获取用户权限
   * @param uid
   */
  async getPermsByUid(uid: number): Promise<string[]> {
    const roleIds = await this.roleService.getRoleIdByUid(uid)
    let perms = []
    let res

    if (includes(roleIds, this.superRoleId)) {
      res = await this.menuModel.find({
        where: { perms: Not(IsNull()), type: 2 }
      })
    } else {
      if (!isEmpty(roleIds)) {
        res = await this.menuModel
          .createQueryBuilder('menu')
          .innerJoinAndSelect(
            'sys_role_menu',
            'role_menu',
            'role_menu.role_id=menu.id'
          )
          .where('role_menu.role_id IN (:...roleIds)', { roleIds })
          .andWhere('menu.type = 2')
          .andWhere('menu.perms IS NOT NULL')
          .getMany()
      }
    }
    if (!isEmpty(res)) {
      res.forEach(e => {
        perms = concat(perms, e.perms.split(','))
      })
      perms = uniq(perms)
    }
    return perms
  }
}
