// src/dto/user.ts
import { Rule, RuleType } from '@midwayjs/validate'
import { PageSearchDto } from '@/dto/comm.dto'

export class UserDTO {
  @Rule(RuleType.string().required())
  username: string
  @Rule(
    RuleType.string()
      .min(3)
      .max(20)
      .pattern(/^[a-z0-9A-Z]+$/)
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
export class UpdateUserDto extends CreateUserDto {
  @Rule(RuleType.number().required().integer())
  id: number
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

export class PageUserDto extends PageSearchDto {
  @Rule(RuleType.array().items(RuleType.number()).min(1).optional())
  departmentIds: number[]
}
export class TransferUserDto {
  @Rule(RuleType.array().items(RuleType.number()).optional())
  userIds: number[]
  @Rule(RuleType.number().required())
  departmentId: number
}

export class DeleteUserDto {
  @Rule(RuleType.array().items(RuleType.number()).required())
  id: number[]
}

export class UpdatePersonInfoDto {
  @Rule(RuleType.string().allow('').allow(null))
  nickName: string

  @Rule(RuleType.string().email().allow('').allow(null))
  email: string

  @Rule(RuleType.string().allow('').allow(null))
  phone: string

  @Rule(RuleType.string().allow('').allow(null))
  remark: string
}

export class UpdatePasswordDto {
  @Rule(RuleType.string().min(6).required())
  originPassword: string

  @Rule(
    RuleType.string()
      .min(6)
      .pattern(/^[a-z0-9A-Z`~!#%^&*=+\\|{};:'\\",<>/?]+$/)
      .required()
  )
  newPassword: string
}

export class PasswordUserDto {
  @Rule(RuleType.number().integer().required())
  userId: number

  @Rule(
    RuleType.string()
      .min(6)
      .pattern(/^[a-z0-9A-Z`~!#%^&*=+\\|{};:'\\",<>/?]+$/)
      .required()
  )
  password: string
}
