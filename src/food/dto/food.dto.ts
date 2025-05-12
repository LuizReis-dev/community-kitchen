import { ApiProperty } from '@nestjs/swagger'
import { Food } from '../entities/food.entity'
import { NutritionFactsDto } from './nutrition-facts.dto'

export class FoodDto {
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

	static fromEntity(food: Food): FoodDto {
		const nutritionFactsDto = NutritionFactsDto.fromEntity(food.nutritionFacts)
		return new FoodDto(food.id, food.name, nutritionFactsDto)
	}
}
