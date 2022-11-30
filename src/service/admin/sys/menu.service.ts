import { InjectEntityModel } from '@midwayjs/typeorm'
import SysMenu from '@/entity/sys/menu.entity'
import { Repository } from 'typeorm'
import { CreateMenuDto } from '@/dto/admin/sys/menu.dto'
import { Provide } from '@midwayjs/decorator'
@Provide()
export class MenuService {
  @InjectEntityModel(SysMenu)
  menu: Repository<SysMenu>

  /**
   * 获取所有菜单
   */
  async list(): Promise<SysMenu[]> {
    return await this.menu.find()
  }

  /**
   * 保存更新
   * @param menu
   */
  async save(menu: CreateMenuDto): Promise<CreateMenuDto> {
    return await this.menu.save(menu)
  }

  /**
   * id获取菜单信息
   * @param mid
   */
  async getMenuItemInfo(mid: number): Promise<SysMenu> {
    return await this.menu.findOne({ where: { id: mid } })
  }
}
