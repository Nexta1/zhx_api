import { RuleType } from '@midwayjs/validate/dist/decorator/rule'
import { Rule } from '@midwayjs/validate'

export class CreateDeptDto {
  @Rule(RuleType.string().required())
  name: string
  @Rule(RuleType.number().integer().required())
  parentId: number
  @Rule(RuleType.number().integer().min(0))
  orderNum: number
}

export class UpdateDeptDto extends CreateDeptDto {
  @Rule(RuleType.number().integer().required())
  id: number
}

export class DeleteDeptDto {
  @Rule(RuleType.number().integer().required())
  id: number
}
