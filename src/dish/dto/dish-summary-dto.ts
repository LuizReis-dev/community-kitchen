import { ApiProperty } from '@nestjs/swagger'
import { Dish } from '../entities/dish.entity'
import { DishFoodDto } from './dishFood.dto'

export class DishSummaryDto {
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
    createdAt: Date,
    updatedAt: Date,
    foods: DishFoodDto[]
  ) {
    this.id = id
    this.name = name
    this.description = description
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.foods = foods
  }

  static fromEntity(dish: Dish, foods: DishFoodDto[]): DishSummaryDto {
    return new DishSummaryDto(
      dish.id,
      dish.name,
      dish.description,
      dish.createdAt,
      dish.updatedAt,
      foods
    )
  }
}