// src/queue/test.queue.ts
import { Processor, IProcessor } from '@midwayjs/bull'

@Processor('test')
export class TestProcessor implements IProcessor {
  async execute(data) {
    // ...
    console.log(data)
  }
}
