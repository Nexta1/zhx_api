import { Inject, Provide } from '@midwayjs/decorator'
import { Framework } from '@midwayjs/bull'
import { InjectEntityModel } from '@midwayjs/typeorm'
import SysTask from '@/entity/task/task.entity'
import { Repository } from 'typeorm'

@Provide()
export class TaskService {
  @Inject()
  bullFramework: Framework
  @InjectEntityModel(SysTask)
  sysTask: Repository<SysTask>

  // async initTask() {
  //   const jobs = await this.bullFramework
  //     .getQueue('test')
  //     .getJobs([
  //       'active',
  //       'delayed',
  //       'failed',
  //       'paused',
  //       'waiting',
  //       'completed'
  //     ])
  // }
  /**
   * 分页查询
   */
  async page(page: number, count: number): Promise<SysTask[]> {
    return await this.sysTask.find({
      order: {
        id: 'ASC'
      },
      take: count,
      skip: page * count
    })
  }
  /**
   * task info
   */
  async info(id: number): Promise<SysTask> {
    return await this.sysTask.findOne({ where: { id } })
  }

  // async addOrUpdate(param) {
  //   const res = await this.sysTask.save(param)
  // }
}
