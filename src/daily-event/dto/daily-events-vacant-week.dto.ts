import { ApiProperty } from '@nestjs/swagger'
import { WEEK_DAYS } from 'src/common/enums/week-days'
import { DailyEvent } from '../entities/daily-event.entity'
import { DailyEventDto } from './daily-event.dto'

export class DailyEventsVacant {
	@ApiProperty({ description: 'Id do evento diário.', example: 1 })
	id: number

	@ApiProperty({ description: 'Especificações do evento diário.', example: 1 })
	name: string

	@ApiProperty({ enum: WEEK_DAYS, isArray: true })
	availableDays: WEEK_DAYS[]

	static fromDto(event: DailyEventDto, availableDays: WEEK_DAYS[]): DailyEventsVacant {
		const dto = new DailyEventsVacant()
		dto.id = event.id
		dto.name = event.name
		dto.availableDays = availableDays
		return dto
	}
}
