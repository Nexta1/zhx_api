import { BaseService } from '@/service/base.service'
import { Inject, Provide } from '@midwayjs/decorator'
import { RedisService } from '@midwayjs/redis'
import { InjectEntityModel } from '@midwayjs/typeorm'
import SysLoginLog from '@/entity/sys/login_log.entity'
import { Repository } from 'typeorm'
import { isEmpty } from 'lodash'
import { UAParser } from 'ua-parser-js'
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
    const result = await this.loginModel
      .createQueryBuilder('log')
      .innerJoinAndSelect('sys_user', 'user', 'user.id=log.user_id')
      .select(['MAX(log.create_time) createTime', 'user', 'log'])
      .groupBy('log.user_id')
      .getRawMany()
    if (!isEmpty(result)) {
      const parser = new UAParser()
      return result.map(e => {
        const u = parser.setUA(e.log_ua).getResult()
        return {
          id: e.user_id,
          ip: e.ip,
          username: e.user_username,
          time: e.createTime,
          os: `${u.os.name} ${u.os.version}`,
          browser: `${u.browser.name} ${u.browser.version}`
        }
      })
    } else {
      return []
    }
  }
}
