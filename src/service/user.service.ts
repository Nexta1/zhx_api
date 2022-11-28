import { Inject, Provide } from '@midwayjs/decorator'
import { InjectEntityModel } from '@midwayjs/typeorm'
import { UserEntity } from '@/entity/user.entity'
import { Repository } from 'typeorm'
import { UserDTO } from '@/dto/user.dto'
import { Context } from '@midwayjs/koa'
import { Utils } from '@/common/utils'

@Provide()
export class UserService {
  @InjectEntityModel(UserEntity)
  userModel: Repository<UserEntity>
  @Inject()
  ctx: Context
  @Inject()
  utils: Utils
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
