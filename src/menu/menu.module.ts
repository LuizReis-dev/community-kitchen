import { Module } from '@nestjs/common'
import { MenuService } from './menu.service'
import { MenuController } from './menu.controller'
import { DatabaseModule } from 'src/database/database.module'
import { MenuRepository } from './menu.repository'
import { DishModule } from 'src/dish/dish.module'
import { DailyEventModule } from 'src/daily-event/daily-event.module'
import { MenuAttendance } from 'src/menu-attendance/entities/menu-attendance.entity'

@Module({
	imports: [DatabaseModule, DishModule, DailyEventModule, MenuAttendance],
	controllers: [MenuController],
	providers: [MenuService, MenuRepository],
	exports: [MenuService],
})
export class MenuModule {}
