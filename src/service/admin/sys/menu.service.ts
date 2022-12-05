import { InjectEntityModel } from '@midwayjs/typeorm'
import SysMenu from '@/entity/sys/menu.entity'
import { In, IsNull, Not, Repository } from 'typeorm'
import { CreateMenuDto, UpdateMenuDto } from '@/dto/admin/sys/menu.dto'
import { Config, Inject, Provide } from '@midwayjs/decorator'
import { RoleService } from '@/service/admin/sys/role.service'
import {
  concat,
  filter,
  flattenDeep,
  includes,
  isEmpty,
  map,
  uniq
} from 'lodash'
import { RedisService } from '@midwayjs/redis'

@Provide()
export class MenuService {
  @InjectEntityModel(SysMenu)
  menuModel: Repository<SysMenu>
  @Inject()
  roleService: RoleService
  @Config('superRoleId')
  superRoleId: number
  @Inject()
  redisService: RedisService
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
  async save(
    menu: CreateMenuDto | UpdateMenuDto
  ): Promise<CreateMenuDto | UpdateMenuDto> {
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

  /**
   * 删除菜单
   * @param menuIds
   */
  async delete(menuIds: number[]) {
    await this.menuModel.delete(menuIds)
  }

  /**
   * 查询子菜单
   * @param menuIds
   */
  async searchChildMenus(menuIds: number[]) {
    const deleteMenuIds = [].concat(menuIds)
    const menus = await this.menuModel.find({
      where: { parentId: In(menuIds) }
    })
    const ids = map(filter(menus, ['type', 0]), 'id')
    deleteMenuIds.push(map(menus, 'id'))
    if (!isEmpty(ids)) {
      deleteMenuIds.push(await this.searchChildMenus(ids))
    }
    return uniq(flattenDeep(deleteMenuIds))
  }
  /**
   * 刷新指定用户ID的权限
   */
  async refreshPerms(uid: number): Promise<void> {
    const perms = await this.getPermsByUid(uid)
    const online = await this.redisService.get(`admin:token:${uid}`)
    if (online) {
      // 判断是否在线
      await this.redisService.set(`admin:perms:${uid}`, JSON.stringify(perms))
    }
  }
  /**
   * 刷新在线用户权限
   */
  async refreshOnlineUserPerms() {
    const onlineUserIds: string[] = await this.redisService.keys(
      'admin:token:*'
    )
    if (onlineUserIds && onlineUserIds.length > 0) {
      for (const i in onlineUserIds) {
        const uid = onlineUserIds[i].split('admin:token:')[1]
        const perms = await this.getPermsByUid(Number(uid))
        await this.redisService.set(`admin:perms:${uid}`, JSON.stringify(perms))
      }
    }
  }
}
