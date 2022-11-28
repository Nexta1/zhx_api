// src/dto/user.ts
import { Rule, RuleType } from '@midwayjs/validate'

export class UserDTO {
  @Rule(RuleType.string().required())
  username: string
  @Rule(RuleType.string().required())
  password: string
}

export class LoginInfoDto {
  @Rule(RuleType.string().required())
  username: string
  @Rule(RuleType.string().required())
  password: string
  @Rule(RuleType.string().required())
  captchaId: string
  @Rule(RuleType.string().required())
  verifyCode: string
}
