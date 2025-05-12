import { ApiProperty } from '@nestjs/swagger'
import { DishDto } from 'src/dish/dto/dish.dto'
import { Menu } from '../entities/menu.entity'

export class MenuDto {
	constructor(
		id: number,
		availabilityDate: Date,
		availabilityHour: number,
		createdBy: string,
		dishes: DishDto[]
	) {
		this.id = id
		this.availabilityDate = availabilityDate
		this.availabilityHour = availabilityHour
		this.createdBy = createdBy
		this.dishes = dishes
	}

	@ApiProperty()
	id: number

	@ApiProperty()
	availabilityDate: Date

	@ApiProperty()
	availabilityHour: number

	@ApiProperty()
	createdBy: string

	@ApiProperty({ type: [DishDto] })
	dishes: DishDto[]

	static fromEntity(menu: Menu): MenuDto {
		const dishes = menu.dishes.map(dish => DishDto.fromEntity(dish))
		const availabilityDate = menu.availabilityDate
		const availabilityHour = menu.availabilityHour
		const createdBy = menu.createdBy
		const id = menu.id

		return new MenuDto(id, availabilityDate, availabilityHour, createdBy, dishes)
	}
}
