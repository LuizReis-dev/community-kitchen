import { Dish } from '../entities/dish.entity'
import { Food } from 'src/food/entities/food.entity'

export class DishDto {
  id: number
  name: string
  description?: string
  createdAt: Date
  updatedAt: Date
  foods: { id: number; name: string }[]

  constructor(
    id: number,
    name: string,
    description: string | undefined,
    createdAt: Date,
    updatedAt: Date,
    foods: { id: number; name: string }[]
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
      ? dish.foods.map((food: Food) => ({
          id: food.id,
          name: food.name,
        }))
      : []

    return new DishDto(dish.id, dish.name, dish.description, dish.createdAt, dish.updatedAt, foods)
  }
}
