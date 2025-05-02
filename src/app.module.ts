import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FoodModule } from './food/food.module';

@Module({
  imports: [FoodModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
