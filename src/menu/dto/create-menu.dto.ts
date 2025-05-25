import { ApiProperty } from '@nestjs/swagger'
import { IsRequiredDate, IsRequiredTypeOf } from 'src/common/decorators/validation'

export class CreateMenuDto {
	@IsRequiredDate()
	@ApiProperty()
	activationDate: Date

	@IsRequiredTypeOf('string')
	@ApiProperty()
	availableDay: string

	@IsRequiredTypeOf('string')
	@ApiProperty()
	createdBy: string

	@IsRequiredTypeOf('number[]')
	@ApiProperty({ type: [Number] })
	dishes: number[]

	// TODO: implement daily event to menu
	// @IsRequiredTypeOf('number')
	// @ApiProperty()
	// dailyEvent: number
}
