import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { BaseEntity } from '@/entity/base.entity'

@Entity({ name: 'sys_user' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', comment: '用户名' })
  username: string

  @Column({ type: 'varchar', nullable: true, comment: '备注' })
  description: string

  @Column({ type: 'varchar', comment: '密码' })
  password: string
}
