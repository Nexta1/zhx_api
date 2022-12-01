import { TypeORMDataSourceManager } from '@midwayjs/typeorm'
import { Inject } from '@midwayjs/decorator'
import { DataSource } from 'typeorm'

export class BaseService {
  @Inject()
  dataSourceManager: TypeORMDataSourceManager

  /**
   * v3版本写法
   */
  getManager(): DataSource {
    return this.dataSourceManager.getDataSource('default')
  }
}
