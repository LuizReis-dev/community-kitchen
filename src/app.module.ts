import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { FoodModule } from './food/food.module'
import { DatabaseModule } from './database/database.module'
import { DishModule } from './dish/dish.module'
import { MenuModule } from './menu/menu.module'
import { MenuRequirementModule } from './menu-requirement/menu-requirement.module'
import { DailyEventModule } from './daily-event/daily-event.module'
import { CustomerModule } from './customer/customer.module'
import { MenuAttendanceModule } from './menu-attendance/menu-attendance.module'
import { APP_GUARD } from '@nestjs/core'
import { AuthModule } from './auth/auth.module'
import { AuthGuard } from './auth/auth.guard'

@Module({
	imports: [
		FoodModule,
		DatabaseModule,
		DishModule,
		MenuModule,
		MenuRequirementModule,
		DailyEventModule,
		CustomerModule,
		MenuAttendanceModule,
		AuthModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_GUARD,
			useClass: AuthGuard,
		},
	],
})
export class AppModule {}
