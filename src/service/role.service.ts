import { InjectEntityModel } from '@midwayjs/typeorm'
import SysRole from '@/entity/sys/role.entity'
import { Repository } from 'typeorm'

export class SysRoleService {
  @InjectEntityModel(SysRole)
  role: Repository<SysRole>
}
