import { PartialType } from '@nestjs/mapped-types'
import { CreateDishDto } from './create-dish.dto'

export class UpdateDishDto extends PartialType(CreateDishDto) {
  name?: string
  description?: string
  foodIds?: number[]

  static isValid(obj: UpdateDishDto): boolean {
    if (obj.name !== undefined && !obj.name?.trim()) return false
    if (obj.description !== undefined && typeof obj.description !== 'string') return false
    if (obj.foodIds !== undefined) {
      if (!Array.isArray(obj.foodIds)) return false
      if (
        obj.foodIds.length > 0 &&
        !obj.foodIds.every(id => typeof id === 'number' && Number.isInteger(id))
      )
        return false
    }
    return true
  }
}
