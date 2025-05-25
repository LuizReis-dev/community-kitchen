import { ApiProperty } from '@nestjs/swagger'
import { IsEnum } from 'class-validator'
import { IsRequiredDate, IsRequiredTypeOf } from 'src/common/decorators/validation'
import { WEEK_DAYS } from 'src/common/enums/week-days'

export class CreateMenuDto {
	@IsRequiredDate()
	@ApiProperty()
	activationDate: Date

	@IsEnum(WEEK_DAYS, {
		message:
			'availableDay must be a valid week day (Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday)',
	})
	@ApiProperty()
	availableDay: string

	@IsRequiredTypeOf('string')
	@ApiProperty()
	createdBy: string

	@IsRequiredTypeOf('number[]')
	@ApiProperty({ type: [Number] })
	dishes: number[]

	@IsRequiredTypeOf('number')
	@ApiProperty()
	dailyEventId: number
}
