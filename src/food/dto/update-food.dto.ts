import { PartialType } from '@nestjs/mapped-types'
import { CreateFoodDto } from './create-food.dto'
import { NutritionFactsDto } from './nutrition-facts.dto'

export class UpdateFoodDto extends PartialType(CreateFoodDto) {
  name: string
  nutritionFacts: NutritionFactsDto
  static isValid(obj: UpdateFoodDto): boolean {
    if (!obj.name?.trim()) return false
    return NutritionFactsDto.isValid(obj.nutritionFacts)
  }
}
