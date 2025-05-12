import { ApiProperty } from '@nestjs/swagger'
import { IsRequiredDate, IsRequiredTypeOf } from 'src/decorators/validation'

export class CreateMenuDto {
	@IsRequiredDate()
	@ApiProperty()
	availabilityDate: Date

	@IsRequiredTypeOf('number')
	@ApiProperty()
	availabilityHour: number

	@IsRequiredTypeOf('string')
	@ApiProperty()
	createdBy: string

	@IsRequiredTypeOf('number[]')
	@ApiProperty({ type: [Number] })
	dishes: number[]
}
