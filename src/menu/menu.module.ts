import { Module } from '@nestjs/common'
import { MenuService } from './menu.service'
import { MenuController } from './menu.controller'
import { DatabaseModule } from 'src/database/database.module'
import { MenuRepository } from './menu.repository'
import { MenuRequirementModule } from 'src/menu-requirement/menu-requirement.module'
import { DishModule } from 'src/dish/dish.module'

@Module({
	imports: [DatabaseModule, MenuRequirementModule, DishModule],
	controllers: [MenuController],
	providers: [MenuService, MenuRepository],
})
export class MenuModule {}
