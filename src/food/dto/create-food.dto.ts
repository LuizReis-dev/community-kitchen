import { ApiProperty } from '@nestjs/swagger'
import { NutritionFactsDto } from './nutrition-facts.dto'

export class CreateFoodDto {
	@ApiProperty({
		example: 'Arroz Integral',
		description: 'Nome do alimento',
	})
	name: string

	@ApiProperty({
		type: () => NutritionFactsDto,
		description: 'Informações nutricionais do alimento',
	})
	nutritionFacts: NutritionFactsDto

	static isValid(obj: CreateFoodDto): boolean {
		if (!obj.name?.trim()) return false
		return NutritionFactsDto.isValid(obj.nutritionFacts)
	}
}
