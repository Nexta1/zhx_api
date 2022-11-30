import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { BaseEntity } from '@/entity/base.entity'

@Entity({ name: 'sys_user' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column('varchar', { comment: '用户名', unique: true, length: 20 })
  username: string

  @Column({ nullable: true, comment: '备注' })
  description: string

  @Column({ comment: '密码' })
  password: string

  @Column({ length: 32 })
  salt: string

  @Column({ name: 'department_id', nullable: true })
  departmentId: number

  @Column({ name: 'nick_name', nullable: true })
  nickName: string

  @Column({ name: 'head_img', nullable: true })
  headImg: string

  @Column({ nullable: true })
  email: string
  @Column({ nullable: true })
  phone: string
  @Column({ nullable: true })
  remark: string
  @Column({ type: 'tinyint', nullable: true })
  status: number
}
