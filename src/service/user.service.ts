import { Inject, Provide } from '@midwayjs/decorator'
import { InjectEntityModel } from '@midwayjs/typeorm'
import { UserEntity } from '@/entity/user.entity'
import { Repository } from 'typeorm'
import { UserDTO } from '@/dto/user.dto'
import { Context } from '@midwayjs/koa'

@Provide()
export class UserService {
  @InjectEntityModel(UserEntity)
  userModel: Repository<UserEntity>
  @Inject()
  ctx: Context

  // save
  async createUser(params: UserDTO): Promise<boolean> {
    const res = await this.getUser(params)
    if (res) {
      return false
    }
    await this.userModel.save(params)
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
