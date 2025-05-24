import { PartialType } from '@nestjs/swagger';
import { CreateDailyEventDto } from './create-daily-event.dto';

export class UpdateDailyEventDto extends PartialType(CreateDailyEventDto) {}
