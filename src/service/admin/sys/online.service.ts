import { BaseService } from '@/service/base.service'
import { Inject, Provide } from '@midwayjs/decorator'
import { RedisService } from '@midwayjs/redis'
import { InjectEntityModel } from '@midwayjs/typeorm'
import SysLoginLog from '@/entity/sys/login_log.entity'
import { Repository } from 'typeorm'
@Provide()
export class OnlineService extends BaseService {
  @Inject()
  redisService: RedisService
  @InjectEntityModel(SysLoginLog)
  loginModel: Repository<SysLoginLog>
  async list() {
    const onlineUserIds = await this.redisService.keys('admin:token:*')
    const formatNumberIds: number[] = onlineUserIds.map(e => {
      const uid = e.split('admin:token:')[1]
      return parseInt(uid)
    })
    return await this.findLastLoginInfoList(formatNumberIds)
  }
  async findLastLoginInfoList(ids: number[]) {
    //todo
    const result = await this.getManager().query(
      `
    SELECT n.*, u.username
      FROM sys_login_log n
      INNER JOIN (
        SELECT user_id, MAX(create_time)AS createTime
        FROM sys_login_log GROUP BY user_id
      ) AS max USING (user_id, createTime)
      INNER JOIN sys_user u ON n.user_id = u.id
      WHERE n.user_id IN (?)
    `,
      [ids]
    )
    return result
  }
}
