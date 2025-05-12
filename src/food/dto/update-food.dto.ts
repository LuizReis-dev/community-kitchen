import { PartialType } from '@nestjs/mapped-types'
import { CreateFoodDto } from './create-food.dto'
import { NutritionFactsDto } from './nutrition-facts.dto'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateFoodDto extends PartialType(CreateFoodDto) {
	@ApiProperty()
	name: string

	@ApiProperty()
	nutritionFacts: NutritionFactsDto
	static isValid(obj: UpdateFoodDto): boolean {
		if (!obj.name?.trim()) return false
		return NutritionFactsDto.isValid(obj.nutritionFacts)
	}
}
