import { Module } from '@nestjs/common'
import { DailyEventService } from './daily-event.service'
import { DailyEventController } from './daily-event.controller'
import { DatabaseModule } from 'src/database/database.module'
import { DailyEventRepository } from './daily-event.repository'

@Module({
	imports: [DatabaseModule],
	controllers: [DailyEventController],
	providers: [DailyEventService, DailyEventRepository],
})
export class DailyEventModule {}
