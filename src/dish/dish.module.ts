import { Module } from '@nestjs/common';
import { DishesService } from './dish.service';
import { DishesController } from './dish.controller';

@Module({
  controllers: [DishesController],
  providers: [DishesService],
})
export class DishModule {}
