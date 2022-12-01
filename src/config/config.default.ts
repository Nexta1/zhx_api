import { MidwayConfig } from '@midwayjs/core'

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
  superRoleId: 1
} as MidwayConfig
