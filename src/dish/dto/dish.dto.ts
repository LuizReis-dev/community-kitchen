import { ApiProperty } from '@nestjs/swagger'
import { Dish } from '../entities/dish.entity'
import { FoodDto } from 'src/food/dto/food.dto'

export class DishDto {
	@ApiProperty()
	id: number

	@ApiProperty()
	name: string

	@ApiProperty()
	description?: string

	@ApiProperty()
	createdAt: Date

	@ApiProperty()
	updatedAt: Date

	@ApiProperty()
	foods: FoodDto[]

	constructor(
		id: number,
		name: string,
		description: string | undefined,
		createdAt: Date,
		updatedAt: Date,
		foods: FoodDto[]
	) {
		this.id = id
		this.name = name
		this.description = description
		this.createdAt = createdAt
		this.updatedAt = updatedAt
		this.foods = foods
	}

	static fromEntity(dish: Dish): DishDto {
		const foods = dish.foods
			? dish.foods.map((food: FoodDto) => ({
					id: food.id,
					name: food.name,
					nutritionFacts: food.nutritionFacts,
				}))
			: []

		return new DishDto(dish.id, dish.name, dish.description, dish.createdAt, dish.updatedAt, foods)
	}
}
