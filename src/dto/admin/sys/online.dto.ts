import { Rule, RuleType } from '@midwayjs/validate'

export class KickDto {
  @Rule(RuleType.number().integer().required())
  id: number
}
