import { ApiProperty } from '@nestjs/swagger'
import { IsRequiredDate, IsRequiredTypeOf } from 'src/decorators/validation'
import { DishDto } from 'src/dish/dto/dish.dto'

export class CreateMenuDto {
	@IsRequiredTypeOf('number')
	@ApiProperty()
	id: number

	@IsRequiredDate()
	@ApiProperty()
	availabilityDate: Date

	@IsRequiredTypeOf('number')
	@ApiProperty()
	availabilityHour: number

	@IsRequiredTypeOf({ array: 'number' })
	@ApiProperty({ type: [DishDto] })
	dishes: number[]
}
