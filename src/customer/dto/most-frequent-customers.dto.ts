import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNumber, IsDateString } from 'class-validator'
import { IsRequiredTypeOf } from 'src/common/decorators/validation'
import { Customer } from '../entities/customer.entity'

export class MostFrequentCustomerDto {
	@ApiProperty({
		description: 'ID do cliente',
		example: 1,
	})
	@IsNumber()
	id: number

	@IsRequiredTypeOf('string')
	@ApiProperty({
		description: 'CPF do cliente, apenas números (ex: 12345678900)',
		example: '12345678900',
	})
	taxId: string

	@IsString()
	@ApiProperty({
		description: 'Nome completo do cliente',
		example: 'João da Silva',
	})
	name: string

	@IsDateString()
	@ApiProperty({
		description: 'Data de nascimento no formato ISO (YYYY-MM-DD)',
		example: '1990-05-20',
		type: String,
		format: 'date',
	})
	birthDate: string

	@ApiProperty({
		description: 'Total de vezes que cliente foi na cozinha comunitária',
		example: 15,
	})
	@IsNumber()
	totalAttendences: number

	static fromEntity(customer: Customer & { attendanceCount?: number }): MostFrequentCustomerDto {
		const dto = new MostFrequentCustomerDto()
		dto.id = customer.id
		dto.taxId = customer.taxId
		dto.name = customer.name
		dto.birthDate = String(customer.birthDate)
		dto.totalAttendences = customer.getDataValue('attendanceCount') || 0
		return dto
	}
}
