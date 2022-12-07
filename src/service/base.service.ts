import { TypeORMDataSourceManager } from '@midwayjs/typeorm'
import { Inject } from '@midwayjs/decorator'
import { DataSource } from 'typeorm'
import { Context } from '@midwayjs/koa'

export class BaseService {
  @Inject()
  dataSourceManager: TypeORMDataSourceManager
  @Inject()
  ctx: Context
  /**
   * v3版本写法
   */
  getManager(): DataSource {
    return this.dataSourceManager.getDataSource('default')
  }
}
