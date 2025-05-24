import { Injectable } from '@nestjs/common';
import { CreateDailyEventDto } from './dto/create-daily-event.dto';
import { UpdateDailyEventDto } from './dto/update-daily-event.dto';

@Injectable()
export class DailyEventService {
  create(createDailyEventDto: CreateDailyEventDto) {
    return 'This action adds a new dailyEvent';
  }

  findAll() {
    return `This action returns all dailyEvent`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dailyEvent`;
  }

  update(id: number, updateDailyEventDto: UpdateDailyEventDto) {
    return `This action updates a #${id} dailyEvent`;
  }

  remove(id: number) {
    return `This action removes a #${id} dailyEvent`;
  }
}
