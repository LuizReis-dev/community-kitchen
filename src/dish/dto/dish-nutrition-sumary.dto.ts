import { ApiProperty } from '@nestjs/swagger'
import { Exclude } from 'class-transformer'
import { NutritionFactsDto } from 'src/food/dto/nutrition-facts.dto'
import { Dish } from '../entities/dish.entity'
import { DishFoodDto } from './dishFood.dto'

export class DishNutritionSummaryDto {
  @ApiProperty({ description: 'ID do prato.', example: 1 })
  id: number

  @ApiProperty({ description: 'Nome do prato.', example: 'Frango Frito com Quinoa' })
  name: string

  @ApiProperty({
    description: 'Descrição do prato.',
    required: false,
    example: 'Peito de frango com crosta crocante...',
  })
  description?: string

  @Exclude()
  nutritionFacts: NutritionFactsDto

  @ApiProperty({
    description: 'Data de criação do prato.',
    example: '2025-06-01T14:00:00.000Z',
  })
  createdAt: Date

  @ApiProperty({
    description: 'Data de atualização do prato.',
    example: '2025-06-01T14:00:00.000Z',
  })
  updatedAt: Date

  @ApiProperty({
    description: 'Lista de alimentos ajustados com quantidade e nutrição.',
    type: [DishFoodDto],
  })
  foods: DishFoodDto[]

  constructor(
    id: number,
    name: string,
    description: string | undefined,
    nutritionFacts: NutritionFactsDto,
    //createdAt: Date,
    //updatedAt: Date,
    foods: DishFoodDto[]
  ) {
    this.id = id
    this.name = name
    this.description = description
    this.nutritionFacts = nutritionFacts
    //this.createdAt = createdAt
    //this.updatedAt = updatedAt
    this.foods = foods
  }

  static fromEntity(dish: Dish): DishNutritionSummaryDto {
    if (!dish.foods) {
      throw new Error(`O prato com ID ${dish.id} está incompleto: alimentos não encontrados.`)
    }

    const totalNutritionFacts = new NutritionFactsDto(0, 0, 0, 0, 0, 0, 0)
    const round1 = (value: number) => Math.round(value * 10) / 10
    const foods: DishFoodDto[] = []

    for (const food of dish.foods) {
      const nf = food.nutritionFacts
      if (!nf) continue

      const dishFood = (food as any).DishFood
      const quantity = dishFood?.quantity ?? 100
      const factor = quantity / 100

      totalNutritionFacts.calories += Number(nf.calories) * factor
      totalNutritionFacts.proteins += Number(nf.proteins) * factor
      totalNutritionFacts.carbohydrates += Number(nf.carbohydrates) * factor
      totalNutritionFacts.fats += Number(nf.fats) * factor
      totalNutritionFacts.fiber += Number(nf.fiber) * factor
      totalNutritionFacts.sugar += Number(nf.sugar) * factor
      totalNutritionFacts.sodium += Number(nf.sodium) * factor

      const adjustedNutritionFacts = {
        calories: round1(Number(nf.calories) * factor),
        proteins: round1(Number(nf.proteins) * factor),
        carbohydrates: round1(Number(nf.carbohydrates) * factor),
        fats: round1(Number(nf.fats) * factor),
        fiber: round1(Number(nf.fiber) * factor),
        sugar: round1(Number(nf.sugar) * factor),
        sodium: round1(Number(nf.sodium) * factor),
      }

      foods.push(new DishFoodDto(food.id, food.name, adjustedNutritionFacts, quantity))
    }
    totalNutritionFacts.calories = round1(totalNutritionFacts.calories)
    totalNutritionFacts.proteins = round1(totalNutritionFacts.proteins)
    totalNutritionFacts.carbohydrates = round1(totalNutritionFacts.carbohydrates)
    totalNutritionFacts.fats = round1(totalNutritionFacts.fats)
    totalNutritionFacts.fiber = round1(totalNutritionFacts.fiber)
    totalNutritionFacts.sugar = round1(totalNutritionFacts.sugar)
    totalNutritionFacts.sodium = round1(totalNutritionFacts.sodium)

    return new DishNutritionSummaryDto(
      dish.id,
      dish.name,
      dish.description,
      totalNutritionFacts,
      //dish.createdAt,
      //dish.updatedAt,
      foods
    )
  }
}
