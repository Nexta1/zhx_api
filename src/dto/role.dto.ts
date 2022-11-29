import { Rule, RuleType } from '@midwayjs/validate'

export class DeleteRoleDto {
  @Rule(RuleType.array().items(RuleType.number()).min(1))
  roleIds: number[]
}

export class CreateRoleDto {
  @Rule(RuleType.string().min(2).required())
  name: string

  @Rule(
    RuleType.string()
      .pattern(/^[a-z0-9A-Z]+$/)
      .required()
  )
  label: string

  @Rule(RuleType.string().allow('').allow(null).optional())
  remark: string

  @Rule(RuleType.array().items(RuleType.number()).min(0).optional())
  menus: number[]

  @Rule(RuleType.array().items(RuleType.number()).min(0).optional())
  depts: number[]
}

@Rule(CreateRoleDto)
export class UpdateRoleDto extends CreateRoleDto {
  @Rule(RuleType.number().integer().required())
  roleId: number
}

export class InfoRoleDto {
  @Rule(RuleType.number().integer().required())
  roleId: number
}
