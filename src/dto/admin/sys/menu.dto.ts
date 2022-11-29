import { Rule, RuleType } from '@midwayjs/validate'

/**
 * 增加菜单
 */
export class CreateMenuDto {
  @Rule(RuleType.number().integer().min(0).max(2).required())
  type: number

  @Rule(RuleType.number().integer().required())
  parentId: number

  @Rule(RuleType.string().min(2).required())
  name: string

  @Rule(RuleType.number().integer().min(0))
  orderNum: number

  @Rule(
    RuleType.string().when('type', {
      switch: [
        {
          is: 1,
          then: RuleType.required()
        },
        {
          is: 0,
          then: RuleType.required()
        }
      ],
      otherwise: RuleType.optional()
    })
  )
  router: string

  @Rule(
    RuleType.boolean().when('type', {
      switch: [
        {
          is: 1,
          then: RuleType.required()
        },
        {
          is: 0,
          then: RuleType.required()
        }
      ],
      otherwise: RuleType.optional()
    })
  )
  isShow: boolean

  @Rule(
    RuleType.boolean().when('type', {
      switch: [
        {
          is: 1,
          then: RuleType.required()
        }
      ],
      otherwise: RuleType.optional()
    })
  )
  keepalive: boolean

  @Rule(
    RuleType.string().when('type', {
      switch: [
        {
          is: 1,
          then: RuleType.required()
        },
        {
          is: 0,
          then: RuleType.required()
        }
      ],
      otherwise: RuleType.optional()
    })
  )
  icon: string

  @Rule(
    RuleType.string().when('type', {
      is: 2,
      then: RuleType.required(),
      otherwise: RuleType.allow('').optional()
    })
  )
  perms: string

  @Rule(RuleType.string())
  viewPath: string
}

@Rule(CreateMenuDto)
export class UpdateMenuDto extends CreateMenuDto {
  @Rule(RuleType.number().integer().required())
  menuId: number
}

/**
 * 删除菜单
 */
export class DeleteMenuDto {
  @Rule(RuleType.number().integer().required())
  menuId: number
}

/**
 * 查询菜单
 */
export class InfoMenuDto {
  @Rule(RuleType.number().integer().required())
  menuId: number
}
