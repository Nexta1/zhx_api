import { BaseEntity } from '@/entity/base.entity'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'sys_department' })
export default class SysDepartment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true, name: 'parent_id' })
  parentId: number

  @Column('varchar', { length: 50 })
  name: string

  @Column({ nullable: true, name: 'order_num' })
  orderNum: number
}
