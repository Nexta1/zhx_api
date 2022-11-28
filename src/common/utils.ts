import * as CryptoJS from 'crypto-js'
import { Config, Provide, Scope, ScopeEnum } from '@midwayjs/decorator'

// import { customAlphabet, nanoid } from 'nanoid';

@Provide()
@Scope(ScopeEnum.Singleton)
export class Utils {
  @Config('jwt')
  jwt

  /**
   * AES加密
   */
  aesEncrypt(msg: string, secret: string): string {
    return CryptoJS.AES.encrypt(msg, secret).toString()
  }

  /**
   * AES解密
   */
  aesDecrypt(encrypted: string, secret: string): string {
    return CryptoJS.AES.decrypt(encrypted, secret).toString(CryptoJS.enc.Utf8)
  }

  /**
   * md5加密
   */
  md5(msg: string): string {
    return CryptoJS.MD5(msg).toString()
  }

  /**
   * 生成一个UUID
   */
  // generateUUID(): string {
  //   return nanoid();
  // }

  /**
   * 生成一个随机的值
   */
  // generateRandomValue(
  //   length: number,
  //   placeholder = '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'
  // ): string {
  //   const customNanoid = customAlphabet(placeholder, length);
  //   return customNanoid();
  // }
  /**
   * JsonWebToken Sign
   * https://github.com/auth0/node-jsonwebtoken
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  // jwtSign(sign: any, options?: any): string {
  //   return JsonWebToken.sign(sign, this.jwt.secret, options);
  // }
  //
  // /**
  //  * JsonWebToken Verify
  //  * https://github.com/auth0/node-jsonwebtoken
  //  */
  // // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  // jwtVerify(token: string, options?: any): any {
  //   return JsonWebToken.verify(token, this.jwt.secret, options);
  // }
  // 数组去重
  uniqueArray(arr) {
    return Array.from(new Set(arr))
  }
}
