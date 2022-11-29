import { BaseEntity } from '@/entity/base.entity'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'sys_role' })
export default class SysRole extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'user_id' })
  userId: string

  @Column('varchar', { unique: true, length: 50 })
  name: string

  @Column('varchar', { length: 50, unique: true })
  label: string

  @Column({ nullable: true })
  remark: string
}
