import { ApiProperty } from '@nestjs/swagger'
import { DailyEvent } from '../entities/daily-event.entity'
import { MenuRequirementDto } from 'src/menu-requirement/dto/menu-requirement.dto'

export class DailyEventDto {
	constructor(
		id: number,
		name: string,
		start_time: string,
		end_time: string,
		requirement: MenuRequirementDto
	) {
		this.id = id
		this.name = name
		this.start_time = start_time
		this.end_time = end_time
		this.requirement = requirement
	}

	@ApiProperty()
	id: number

	@ApiProperty()
	requirement: MenuRequirementDto

	@ApiProperty()
	name: string

	@ApiProperty()
	start_time: string

	@ApiProperty()
	end_time: string

	static fromEntity(dailyEvent: DailyEvent): DailyEventDto {
		const id = dailyEvent.id
		const name = dailyEvent.name
		const start_time = dailyEvent.start_time
		const end_time = dailyEvent.end_time
		const requirement = dailyEvent.menu_requirement

		return new DailyEventDto(id, name, start_time, end_time, requirement)
	}
}
