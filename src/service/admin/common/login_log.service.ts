import { Provide } from '@midwayjs/decorator'
import { InjectEntityModel } from '@midwayjs/typeorm'
import SysLoginLog from '@/entity/sys/login_log.entity'
import { Repository } from 'typeorm'
import { BaseService } from '@/service/base.service'
import { UAParser } from 'ua-parser-js'
import { trimStart } from 'lodash'

@Provide()
export class LoginLogService extends BaseService {
  @InjectEntityModel(SysLoginLog)
  loginLog: Repository<SysLoginLog>
  async save(id: number) {
    await this.loginLog.save({
      userId: id,
      ip: trimStart(this.ctx.ip, '::ffff:'),
      ua: this.ctx.get('user-agent')
    })
  }
  async page(page: number, count: number) {
    const res = await this.loginLog
      .createQueryBuilder('login_log')
      .innerJoinAndSelect('sys_user', 'user', 'login_log.user_id = user.id')
      .orderBy('login_log.create_time', 'DESC')
      .offset(page * count)
      .limit(count)
      .getRawMany()
    const parser = new UAParser()
    return res.map(e => {
      const result = parser.setUA(e.login_log_ua).getResult()
      return {
        id: e.login_log_id,
        ip: e.login_log_ip,
        os: `${result.os.name} ${result.os.version}`,
        browser: `${result.browser.name} ${result.browser.version}`,
        time: e.login_log_createTime,
        username: e.user_username
      }
    })
  }
  async count() {
    return await this.loginLog.count()
  }
}
