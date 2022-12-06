import { Inject, Provide } from '@midwayjs/decorator'
import { CaptchaService } from '@midwayjs/captcha'
import { UserEntity } from '@/entity/sys/user.entity'
import { Repository } from 'typeorm'
import { isEmpty } from 'lodash'
import { Utils } from '@/common/utils'
import { InjectEntityModel } from '@midwayjs/typeorm'
import { IImageCaptchaResult } from '@/service/interface'
import { MenuService } from '@/service/admin/sys/menu.service'
import { RedisService } from '@midwayjs/redis'
import { BaseService } from '@/service/base.service'

@Provide()
export class VerifyService extends BaseService {
  @Inject()
  captchaService: CaptchaService
  @Inject()
  menuService: MenuService
  @InjectEntityModel(UserEntity)
  userModel: Repository<UserEntity>
  @Inject()
  utils: Utils
  @Inject()
  redisService: RedisService

  /**
   * 获取验证码
   */
  async getImageCaptcha(): Promise<IImageCaptchaResult> {
    const { id, imageBase64 } = await this.captchaService.image({
      size: 4,
      noise: 3,
      width: 100,
      height: 50,
      type: 'letter'
    })
    return {
      id, // 验证码 id
      imageBase64 // 验证码 SVG 图片的 base64 数据，可以直接放入前端的 img 标签内
    }
  }

  /**
   * 检查验证码
   * @param captchaId
   * @param verifyCode
   */
  async checkImgCaptcha(
    captchaId: string,
    verifyCode: string
  ): Promise<boolean> {
    return await this.captchaService.check(captchaId, verifyCode)
  }

  /**
   * 验证账号密码
   * @param username
   * @param password
   */
  async getLoginSign(username: string, password: string): Promise<string> {
    const user = await this.userModel.findOne({
      where: {
        username
      }
    })

    if (isEmpty(user)) {
      return null
    }
    const comparePassword = this.utils.md5(password + user.salt)
    if (user.password !== comparePassword) {
      return null
    }
    const jwtSign = this.utils.jwtSign(
      {
        uid: parseInt(user.id.toString()),
        pv: 1
      },
      {
        expiresIn: '2d'
      }
    )
    const perms = await this.menuService.getPermsByUid(user.id)

    console.log(await this.redisService.set('admin:pv:' + user.id, 1))
    await this.redisService.set(`admin:token:` + user.id, jwtSign)
    await this.redisService.set('admin:perms:' + user.id, JSON.stringify(perms))
    return jwtSign
  }

  /**
   * 获取用户权限菜单
   * @param uid
   */
  async getPermsByUid(uid: number) {
    const menus = await this.menuService.getMenusByUid(uid)
    const perms = await this.menuService.getPermsByUid(uid)
    return { menus, perms }
  }
}
