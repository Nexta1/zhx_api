import { Inject, Provide } from '@midwayjs/decorator'
import { CaptchaService } from '@midwayjs/captcha'
import { UserEntity } from '@/entity/user.entity'
import { Repository } from 'typeorm'
import { isEmpty } from 'lodash'
import { Utils } from '@/common/utils'
import { InjectEntityModel } from '@midwayjs/typeorm'
import { IImageCaptchaResult } from '@/service/interface'

@Provide()
export class VerifyService {
  @Inject()
  captchaService: CaptchaService
  @InjectEntityModel(UserEntity)
  userModel: Repository<UserEntity>
  @Inject()
  utils: Utils
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

  async checkImgCaptcha(
    captchaId: string,
    verifyCode: string
  ): Promise<boolean> {
    return await this.captchaService.check(captchaId, verifyCode)
  }

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

    return this.utils.jwtSign(
      {
        uid: parseInt(user.id.toString())
        // pv: 1,
      },
      {
        expiresIn: '2d'
      }
    )
  }
}
