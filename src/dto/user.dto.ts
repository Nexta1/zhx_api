// src/dto/user.ts
import { Rule, RuleType } from '@midwayjs/validate'

export class UserDTO {
  @Rule(RuleType.string().required())
  username: string
  @Rule(
    RuleType.string()
      .min(3)
      .max(20)
      .pattern(/^[a-z0-9A-Z]+$/)
      .required()
  )
  password: string
}

export class CreateUserDto extends UserDTO {
  @Rule(RuleType.number().integer().required())
  departmentId: number

  @Rule(RuleType.string().min(2).required())
  name: string

  @Rule(RuleType.string().empty('').optional())
  nickName: string

  @Rule(RuleType.array().items(RuleType.number()).min(1).max(5).required())
  roles: number[]

  @Rule(RuleType.string().empty('').optional())
  remark: string

  @Rule(RuleType.string().empty('').email().optional())
  email: string

  @Rule(RuleType.string().empty('').optional())
  phone: string

  @Rule(RuleType.number().integer().valid(0, 1).optional())
  status: number
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
