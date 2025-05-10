import { Food } from '../entities/food.entity'
import { NutritionFacts } from '../entities/nutrition-facts.entity'
import { NutritionFactsDto } from './nutrition-facts.dto'

export class FoodDto {
  id: number
  name: string
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
