import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsDateString } from 'class-validator'
import { IsRequiredTypeOf } from 'src/common/decorators/validation'
import { Customer } from '../entities/customer.entity'

export class CustomerDto {
	@ApiProperty()
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

	constructor(id: number, taxId: string, name: string, birthDate: string) {
		this.id = id
		this.taxId = taxId
		this.name = name
		this.birthDate = birthDate
	}

	static fromEntity(customer: Customer): CustomerDto {
		return new CustomerDto(customer.id, customer.taxId, customer.name, String(customer.birthDate))
	}
}
