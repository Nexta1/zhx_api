import { Inject, Provide } from '@midwayjs/decorator'
import { InjectEntityModel } from '@midwayjs/typeorm'
import { UserEntity } from '@/entity/sys/user.entity'
import { Repository } from 'typeorm'
import { CreateUserDto, UserDTO } from '@/dto/user.dto'
import { Utils } from '@/common/utils'
import { BaseService } from '@/service/base.service'
import SysUserRole from '@/entity/sys/user_role.entity'

@Provide()
export class UserService extends BaseService {
  @InjectEntityModel(UserEntity)
  userModel: Repository<UserEntity>
  @Inject()
  utils: Utils

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
    console.log(exist)
    if (!this.utils.isEmpty(exist)) {
      return false
    }
    await this.getManager().transaction(async manager => {
      const salt = this.utils.generateRandomValue(32)
      const password = this.utils.md5(userDto.password + salt)
      const user = manager.create(
        UserEntity,
        this.utils.OmitObject(
          Object.assign(userDto, { password, salt }),
          'roles'
        )
      )
      const res = await manager.save(user)
      const { roles } = userDto
      const insertRole = roles.map(e => {
        return {
          roleId: e,
          userId: res.id
        }
      })
      await manager.insert(SysUserRole, insertRole)
    })
    return true
  }
  // save
  async createUser(params: UserDTO): Promise<boolean> {
    const salt = this.utils.generateRandomValue(32)
    const data = Object.assign(params, {
      password: this.utils.md5(params.password + salt),
      salt
    })
    const res = await this.getUser(data)
    if (res) {
      return false
    }
    await this.userModel.save(data)
    return true
  }

  //find
  async getUser(params) {
    const whereOpt = {}
    const { id, username } = params
    id && Object.assign(whereOpt, { id })
    username && Object.assign(whereOpt, { username })
    return await this.userModel.findOne({ where: whereOpt })
  }
}
