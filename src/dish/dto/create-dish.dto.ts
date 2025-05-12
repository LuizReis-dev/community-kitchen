import { ApiProperty } from '@nestjs/swagger'

export class CreateDishDto {
	@ApiProperty()
	name: string

	@ApiProperty({ required: false })
	description?: string

	@ApiProperty()
	foodIds: number[]

	static isValid(obj: CreateDishDto): boolean {
		if (!obj.name?.trim()) return false
		if (obj.description !== undefined && typeof obj.description !== 'string') return false
		if (!Array.isArray(obj.foodIds) || obj.foodIds.length === 0) return false
		if (!obj.foodIds.every(id => typeof id === 'number' && Number.isInteger(id))) return false

		return true
	}
}
