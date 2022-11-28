import { MidwayConfig } from '@midwayjs/core'
import { UserEntity } from '@/entity/user.entity'

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1669446653893_5516',
  koa: {
    port: 7001
  },
  jwt: {
    secret: 'zhx_password', // fs.readFileSync('xxxxx.key')
    expiresIn: '2d' // https://github.com/vercel/ms
  },
  typeorm: {
    dataSource: {
      default: {
        /**
         * 单数据库实例
         */
        type: 'mysql',
        host: '119.91.63.89',
        port: 3306,
        username: 'my',
        password: '2KJdPLSBCGXkKmHy',
        database: 'my',
        synchronize: false, // 如果第一次使用，不存在表，有同步的需求可以写 true
        logging: false,
        // 配置实体模型 或者 entities: '/entity',
        // entities: [Photo],
        entities: [UserEntity]
      }
    }
  }
} as MidwayConfig
