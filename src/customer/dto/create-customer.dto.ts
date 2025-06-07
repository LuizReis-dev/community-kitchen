import { ApiProperty } from '@nestjs/swagger'
import {
	IsCpf,
	IsPastDate,
	IsRequiredDate,
	IsRequiredTypeOf,
} from 'src/common/decorators/validation'

export class CreateCustomerDto {
	@IsRequiredTypeOf('string')
	@IsCpf()
	@ApiProperty({ example: '12345678909' })
	taxId: string

	@IsRequiredTypeOf('string')
	@ApiProperty({ example: 'João da Silva' })
	name: string

	@IsRequiredDate()
	@IsPastDate()
	@ApiProperty({ example: '1990-01-01', format: 'date' })
	birthDate: string
}
