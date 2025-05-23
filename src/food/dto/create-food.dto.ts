import { ApiProperty } from '@nestjs/swagger'
import { NutritionFactsDto } from './nutrition-facts.dto'

export class CreateFoodDto {
	@ApiProperty()
	name: string

	@ApiProperty()
	nutritionFacts: NutritionFactsDto

	static isValid(obj: CreateFoodDto): boolean {
		if (!obj.name?.trim()) return false
		return NutritionFactsDto.isValid(obj.nutritionFacts)
	}
}
