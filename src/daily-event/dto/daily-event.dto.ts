import { ApiProperty } from '@nestjs/swagger'
import { DailyEvent } from '../entities/daily-event.entity'

export class DailyEventDto {
	constructor(
		id: number,
		requirement_id: number,
		name: string,
		start_time: string,
		end_time: string
	) {
		this.id = id
		this.requirement_id = requirement_id
		this.name = name
		this.start_time = start_time
		this.end_time = end_time
	}

	@ApiProperty()
	id: number

	@ApiProperty()
	requirement_id: number

	@ApiProperty()
	name: string

	@ApiProperty()
	start_time: string

	@ApiProperty()
	end_time: string

	static fromEntity(dailyEvent: DailyEvent): DailyEventDto {
		const id = dailyEvent.id
		const requirement_id = dailyEvent.requirement_id
		const name = dailyEvent.name
		const start_time = dailyEvent.start_time
		const end_time = dailyEvent.end_time

		return new DailyEventDto(id, requirement_id, name, start_time, end_time)
	}
}
