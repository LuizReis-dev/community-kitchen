import { ApiProperty } from '@nestjs/swagger'
import { Dish } from '../entities/dish.entity'
import { NutritionFactsDto } from 'src/food/dto/nutrition-facts.dto'

export class DishNutritionFactsDto {
	@ApiProperty()
	id: number

	@ApiProperty()
	name: string

	@ApiProperty()
	nutritionFacts: NutritionFactsDto
	

	constructor(id: number, name: string, nutritionFacts: NutritionFactsDto) {
		this.id = id
		this.name = name
		this.nutritionFacts = nutritionFacts
	}

	static fromEntity(dish: Dish, nutritionFacts: NutritionFactsDto): DishNutritionFactsDto {
		return new DishNutritionFactsDto(dish.id, dish.name, nutritionFacts)
	}
}
