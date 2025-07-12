import { ApiProperty } from '@nestjs/swagger'
import { DailyEvent } from '../entities/daily-event.entity'
import { MenuRequirementDto } from 'src/menu-requirement/dto/menu-requirement.dto'

export class DailyEventDto {
	constructor(
		id: number,
		name: string,
		startTime: string,
		endTime: string,
		requirement: MenuRequirementDto,
		createdAt: Date,
		updatedAt: Date,
		deletedAt: Date | null		
	) {
		this.id = id
		this.name = name
		this.startTime = startTime
		this.endTime = endTime
		this.requirement = requirement
		this.createdAt = createdAt
		this.updatedAt = updatedAt
		this.deletedAt = deletedAt
	}

	@ApiProperty({ description: 'Id do evento diário.', example: 1 })
	id: number

	@ApiProperty({ description: 'Especificações do evento diário.', example: 1 })
	requirement: MenuRequirementDto

	@ApiProperty({ description: 'Nome do evento diário.', example: 'Almoço' })
	name: string

	@ApiProperty({ description: 'Horario de inicio do evento diário.', example: '12:00:00' })
	startTime: string

	@ApiProperty({ description: 'Horario de termino do evento diário.', example: '14:00:00' })
	endTime: string

	@ApiProperty({
	description: 'Data de criação do evento diário.',
	example: '2025-06-01T14:00:00.000Z',
	})
	createdAt: Date

	@ApiProperty({
	description: 'Data de atualização do evento diário.',
	example: '2025-06-01T14:00:00.000Z',
	})
	updatedAt: Date
	
	@ApiProperty({
	description: 'Data de exclusão do evento diário.',
	example: '2025-06-01T14:00:00.000Z',
	})
	deletedAt: Date | null

	static fromEntity(dailyEvent: DailyEvent): DailyEventDto {
		const id = dailyEvent.id
		const name = dailyEvent.name
		const startTime = dailyEvent.startTime
		const endTime = dailyEvent.endTime
		const requirement = dailyEvent.menuRequirement
    	const createdAt = dailyEvent.createdAt;
    	const updatedAt = dailyEvent.updatedAt;
    	const deletedAt = dailyEvent.deletedAt;

		return new DailyEventDto(id, name, startTime, endTime, requirement, createdAt, updatedAt, deletedAt)
	}
}
