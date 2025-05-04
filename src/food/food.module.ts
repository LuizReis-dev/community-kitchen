import { Module } from '@nestjs/common';
import { FoodService } from './food.service';
import { FoodController } from './food.controller';
import { FoodRepository } from './food.repository';

@Module({
  controllers: [FoodController],
  providers: [FoodService, FoodRepository],
})
export class FoodModule {}
