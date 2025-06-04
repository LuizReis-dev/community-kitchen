import { ApiProperty } from '@nestjs/swagger'
import { DailyEventDto } from './daily-event.dto'

export class UnassignedDailyEventDto {
	@ApiProperty()
	id: number

	@ApiProperty()
	name: string

    @ApiProperty()
    startTime: string

    @ApiProperty()
    endTime: string

	static fromDto(dto: DailyEventDto): UnassignedDailyEventDto {
        const mapped = new UnassignedDailyEventDto()
        mapped.id = dto.id
        mapped.name = dto.name
        mapped.startTime = dto.start_time
        mapped.endTime = dto.end_time
        return mapped
    }
}
