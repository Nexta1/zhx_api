import { InjectEntityModel } from '@midwayjs/typeorm'
import SysMenu from '@/entity/sys/menu.entity'
import { Repository } from 'typeorm'
import { CreateMenuDto } from '@/dto/admin/sys/menu.dto'

export class MenuService {
  @InjectEntityModel(SysMenu)
  menu: Repository<SysMenu>
  async list(): Promise<SysMenu[]> {
    return await this.menu.find()
  }
  async save(menu: CreateMenuDto): Promise<CreateMenuDto> {
    return await this.menu.save(menu)
  }
}
