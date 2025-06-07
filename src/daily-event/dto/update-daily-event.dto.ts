import { ApiProperty, PartialType } from '@nestjs/swagger'
import { CreateDailyEventDto } from './create-daily-event.dto'
import { IsNumber, IsOptional, IsString } from 'class-validator'

export class UpdateDailyEventDto extends PartialType(CreateDailyEventDto) {
	@ApiProperty({ example: 1, description: 'Id do MenuRequirement' })
	@IsOptional()
	@IsNumber()
	requirementId: number

	@ApiProperty({ example: 'Café da Manhã', description: 'Nome do Evento diario' })
	@IsOptional()
	@IsString()
	name: string

	@ApiProperty({ example: '06:00:00', description: 'Horario que começa o evento diário' })
	@IsOptional()
	@IsString()
	startTime: string

	@ApiProperty({ example: '10:00:00', description: 'Horario que termina o evento diário' })
	@IsOptional()
	@IsString()
	endTime: string
}
