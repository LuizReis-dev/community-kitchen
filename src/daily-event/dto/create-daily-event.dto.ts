import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNumber, IsNotEmpty, MaxLength } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateDailyEventDto {
	@ApiProperty({
		description: 'Nome do evento.',
		example: 'Jantar.',
	})
	@IsString({ message: 'Nome deve ser uma string.' })
	@IsNotEmpty({ message: 'Nome nao pode ser vazio.' })
	@MaxLength(30, { message: 'O nome não pode possuir mais do que 30 caracteres.' })
	name: string

	@ApiProperty({
		description: 'Hora a qual o evento comeca a ficar disponivel.',
		example: '19:00',
	})
	@IsString({ message: 'Horário de inicio deve ser uma string.' })
	@IsNotEmpty({ message: 'Horário de inicio não pode ser vazio.' })
	startTime: string

	@ApiProperty({
		description: 'Hora a qual o evento encerra.',
		example: '22:30',
	})
	@IsString({ message: 'Horário de encerramento deve ser uma string.' })
	@IsNotEmpty({ message: 'Horário de encerramento não pode ser vazio.' })
	endTime: string

	@ApiProperty({
		description: 'Id do Menu Requirement referente a esse evento.',
		example: 1,
	})
	@Type(() => Number)
	@IsNumber({}, { message: 'Deve ser um número.' })
	@IsNotEmpty({ message: 'O requirement_id não pode ser vazio.' })
	requirementId: number
}
