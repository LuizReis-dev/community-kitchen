import { NutritionFacts } from '../entities/nutrition-facts.entity'

export class NutritionFactsDto {
  calories: number
  carbohydrates: number
  proteins: number
  fats: number
  fiber: number
  sugar: number
  sodium: number

  constructor(
    calories: number,
    carbohydrates: number,
    proteins: number,
    fats: number,
    fiber: number,
    sugar: number,
    sodium: number
  ) {
    this.calories = calories
    this.carbohydrates = carbohydrates
    this.proteins = proteins
    this.fats = fats
    this.fiber = fiber
    this.sugar = sugar
    this.sodium = sodium
  }

  static isValid(obj: NutritionFactsDto): boolean {
    if (!obj) return false
    const fields = [
      obj.calories,
      obj.carbohydrates,
      obj.proteins,
      obj.fats,
      obj.fiber,
      obj.sugar,
      obj.sodium,
    ]

    return fields.every(v => v !== null && v !== undefined)
  }

  static fromEntity(nutritionFacts: NutritionFacts): NutritionFactsDto {
    return new NutritionFactsDto(
      nutritionFacts.calories,
      nutritionFacts.carbohydrates,
      nutritionFacts.proteins,
      nutritionFacts.fats,
      nutritionFacts.fiber,
      nutritionFacts.sugar,
      nutritionFacts.sodium
    )
  }
}
