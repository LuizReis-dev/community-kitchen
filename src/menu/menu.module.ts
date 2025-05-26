import { Module } from '@nestjs/common'
import { MenuService } from './menu.service'
import { MenuController } from './menu.controller'
import { DatabaseModule } from 'src/database/database.module'
import { MenuRepository } from './menu.repository'
import { DishModule } from 'src/dish/dish.module'
import { DailyEventModule } from 'src/daily-event/daily-event.module'

@Module({
	imports: [DatabaseModule, DishModule, DailyEventModule],
	controllers: [MenuController],
	providers: [MenuService, MenuRepository],
})
export class MenuModule {}
