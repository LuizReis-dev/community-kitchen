import { Module } from '@nestjs/common'
import { DishService } from './dish.service'
import { DishController } from './dish.controller'
import { DatabaseModule } from 'src/database/database.module'
import { DishRepository } from './dish.repository'

@Module({
  imports: [DatabaseModule],
  controllers: [DishController],
  providers: [DishService, DishRepository],
})
export class DishModule {}
