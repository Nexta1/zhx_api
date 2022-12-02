/**
 * @Description:返回响应体
 * @author nexta1
 * @date 2022/11/26
 */
export interface ResponseResult {
  data?: any
  code?: number
  message?: string
}

export interface IPageSearchUserResult {
  createTime: string
  departmentId: number
  email: string
  headImg: string
  id: number
  name: string
  nickName: string
  phone: string
  remark: string
  status: number
  updateTime: string
  username: string
  departmentName: string
  roleNames: string[]
}
