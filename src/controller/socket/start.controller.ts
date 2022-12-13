import {
  WSController,
  OnWSConnection,
  Inject,
  OnWSMessage,
  WSEmit
} from '@midwayjs/decorator'
import { Context } from '@midwayjs/socketio'
import { res } from '@/common/utils'

@WSController('/')
export class HelloSocketController {
  @Inject()
  ctx: Context

  @OnWSConnection()
  async onConnectionMethod() {
    console.log('on client connect', this.ctx.id)
  }

  @OnWSMessage('myEvent')
  @WSEmit('myEventResult')
  async gotMessage(data) {
    console.log('on data got', this.ctx.id, data)
    return res({ data: data })
  }
}
