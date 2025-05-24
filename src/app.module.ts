import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { FoodModule } from './food/food.module'
import { DatabaseModule } from './database/database.module'
import { DishModule } from './dish/dish.module'
import { MenuModule } from './menu/menu.module'
import { MenuRequirementModule } from './menu-requirement/menu-requirement.module'
import { DailyEventModule } from './daily-event/daily-event.module'

@Module({
	imports: [
		FoodModule,
		DatabaseModule,
		DishModule,
		MenuModule,
		MenuRequirementModule,
		DailyEventModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
