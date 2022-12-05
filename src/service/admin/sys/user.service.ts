import { Inject, Provide } from '@midwayjs/decorator'
import { InjectEntityModel } from '@midwayjs/typeorm'
import { UserEntity } from '@/entity/sys/user.entity'
import { In, Repository } from 'typeorm'
import {
  CreateUserDto,
  UpdatePasswordDto,
  UpdatePersonInfoDto,
  UpdateUserDto,
  UserDTO
} from '@/dto/admin/sys/user.dto'
import { Utils } from '@/common/utils'
import { BaseService } from '@/service/base.service'
import SysUserRole from '@/entity/sys/user_role.entity'
import { findIndex, isEmpty, omit } from 'lodash'
import { IPageSearchUserResult } from '@/interface'
import { RedisService } from '@midwayjs/redis'

@Provide()
export class UserService extends BaseService {
  @InjectEntityModel(UserEntity)
  userModel: Repository<UserEntity>
  @InjectEntityModel(SysUserRole)
  userRoleModel: Repository<SysUserRole>
  @Inject()
  utils: Utils
  @Inject()
  redisService: RedisService
  /**
   * 查询所有用户
   */
  async list(): Promise<UserEntity[]> {
    return await this.userModel.find()
  }

  /**
   * 增加用户
   * @param userDto
   */
  async add(userDto: CreateUserDto) {
    const exist = await this.userModel.findOne({
      where: { username: userDto.username }
    })
    if (!this.utils.isEmpty(exist)) {
      return false
    }
    await this.getManager().transaction(async manager => {
      const salt = this.utils.generateRandomValue(32)
      const password = this.utils.md5(userDto.password + salt)
      const user = manager.create(
        UserEntity,
        omit(Object.assign(userDto, { password, salt }), 'roles')
      )
      const { id } = (await manager.save(user)) as UserEntity
      const { roles } = userDto
      const insertRole = roles.map(e => {
        return {
          roleId: e,
          userId: id
        }
      })
      await manager.insert(SysUserRole, insertRole)
    })
    return true
  }

  /**
   * 查询数量
   * @param deptIds
   */
  async count(deptIds: number[]) {
    return await this.userModel.count({ where: { departmentId: In(deptIds) } })
  }

  /**
   * 轉移部門
   * @param userIds
   * @param deptId
   */
  async transfer(userIds: number[], deptId: number) {
    await this.userModel.update({ id: In(userIds) }, { departmentId: deptId })
  }

  /**
   *根據部門id獲取用戶
   * @param uid
   * @param deptIds
   * @param page
   * @param count
   */
  async page(uid: number, deptIds: number[], page: number, count: number) {
    console.log(count)
    const queryAll = !isEmpty(deptIds)
    //todo 沒寫管理員
    const res = await this.userModel
      .createQueryBuilder('user')
      .innerJoinAndSelect('sys_department', 'dept', 'user.departmentId=dept.id')
      .innerJoinAndSelect(
        'sys_user_role',
        'user_role',
        'user_role.user_id=user.id'
      )
      .innerJoinAndSelect('sys_role', 'role', 'role.id=user_role.role_id')
      .where(queryAll ? '1=1' : 'user.departmentId IN (:...deptIds)', {
        deptIds
      })
      .limit(count)
      .offset(count * page)
      .getRawMany()

    const dealResult: IPageSearchUserResult[] = []
    // 过滤去重
    res.forEach(e => {
      const index = findIndex(dealResult, e2 => e2.id === e.user_id)
      if (index < 0) {
        // 当前元素不存在则插入
        dealResult.push({
          createTime: e.user_createTime,
          departmentId: e.user_department_id,
          email: e.user_email,
          headImg: e.user_head_img,
          id: e.user_id,
          name: e.user_name,
          nickName: e.user_nick_name,
          phone: e.user_phone,
          remark: e.user_remark,
          status: e.user_status,
          updateTime: e.user_updateTime,
          username: e.user_username,
          departmentName: e.dept_name,
          roleNames: [e.role_name]
        })
      } else {
        // 已存在
        dealResult[index].roleNames.push(e.role_name)
      }
    })
    return dealResult
  }

  /**
   * 注册用户
   * @param params
   */
  async register(params: UserDTO): Promise<boolean> {
    const salt = this.utils.generateRandomValue(32)
    const data = Object.assign(params, {
      password: this.utils.md5(params.password + salt),
      salt
    })
    const res = await this.info(data)
    if (res) {
      return false
    }
    await this.userModel.save(data)
    return true
  }

  /**
   * 获取信息
   * @param params
   */
  async info(params) {
    const whereOpt = {}
    const { id, username } = params
    id && Object.assign(whereOpt, { id })
    username && Object.assign(whereOpt, { username })
    return await this.userModel.findOne({ where: whereOpt })
  }
  /**
   * 更新个人信息
   */
  async updatePersonInfo(
    uid: number,
    param: UpdatePersonInfoDto
  ): Promise<void> {
    await this.userModel.update(uid, param)
  }
  /**
   * 修改信息
   * @param param
   */
  async update(param: UpdateUserDto) {
    await this.getManager().transaction(async manager => {
      await manager.update(UserEntity, param.id, {
        departmentId: param.departmentId,
        username: param.username,
        name: param.name,
        nickName: param.nickName,
        email: param.email,
        phone: param.phone,
        remark: param.remark,
        status: param.status
      })
      await manager.delete(SysUserRole, { userId: param.id })
      const insertRoles = param.roles.map(e => {
        return { roleId: e, userId: param.id }
      })
      await manager.insert(SysUserRole, insertRoles)
      //todo 禁用客戶
    })
  }

  /**
   * 刪除用戶
   * @param ids
   */
  async delete(ids: number[]) {
    await this.userModel.delete(ids)
    await this.userRoleModel.delete({ userId: In(ids) })
  }

  /**
   * 更该用户密码
   * @param uid
   * @param dto
   */
  async updatePassword(uid: number, dto: UpdatePasswordDto) {
    const user = await this.userModel.findOne({ where: { id: uid } })
    if (isEmpty(user)) {
      throw new Error('用户不存在')
    }
    const comparePassword = this.utils.md5(`${dto.originPassword}${user.salt}`)
    if (user.password !== comparePassword) {
      return false
    }
    const password = this.utils.md5(`${dto.newPassword}${user.salt}`)
    await this.userModel.update({ id: uid }, { password })
    await this.upgradePasswordVersion(uid)
    return true
  }

  /**
   * 强制更新密码
   * @param uid
   * @param password
   */
  async forceUpdatePassword(uid: number, password: string): Promise<boolean> {
    const user: UserEntity = await this.userModel.findOne({
      where: { id: uid }
    })
    if (isEmpty(user)) {
      throw new Error('用户不存在')
    }
    const newPassword = this.utils.md5(`${password}${user.salt}`)
    await this.userModel.update({ id: uid }, { password: newPassword })
    await this.upgradePasswordVersion(uid)
    return true
  }
  /**
   * 更新redis密码版本
   * @param id
   */
  async upgradePasswordVersion(id: number) {
    const version = await this.redisService.get(`admin:passwordVersion:${id}}`)
    if (!isEmpty(version)) {
      await this.redisService.set(
        `admin:passwordVersion:${id}}`,
        parseInt(version) + 1
      )
    }
  }
}
