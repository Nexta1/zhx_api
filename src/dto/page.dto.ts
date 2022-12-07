import { Rule, RuleType } from '@midwayjs/validate'

export class PageSearchDto {
  @Rule(RuleType.number().integer().min(0).default(10))
  limit: number

  @Rule(RuleType.number().integer().min(1).default(1))
  page: number
}
