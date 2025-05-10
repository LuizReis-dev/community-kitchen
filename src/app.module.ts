import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FoodModule } from './food/food.module';
import { DatabaseModule } from './database/database.module';
import { DishModule } from './dish/dish.module';
import { MenuRequirementModule } from './menu-requirement/menu-requirement.module';

@Module({
  imports: [FoodModule, DatabaseModule, DishModule, MenuRequirementModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
