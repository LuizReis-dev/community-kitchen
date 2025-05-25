import { ApiProperty } from '@nestjs/swagger'
import { MenuRequirement } from '../entities/menu-requirement.entity'

export class MenuRequirementDto {
	constructor(
		id: number,
		min_calories: number,
		max_calories: number,
		min_carbohydrates: number,
		max_carbohydrates: number,
		min_proteins: number,
		max_proteins: number,
		min_fats: number,
		max_fats: number,
		min_fiber: number,
		max_fiber: number,
		min_sugar: number,
		max_sugar: number,
		min_sodium: number,
		max_sodium: number,
		is_active: boolean
	) {
		this.id = id
		this.min_calories = min_calories
		this.max_calories = max_calories
		this.min_carbohydrates = min_carbohydrates
		this.max_carbohydrates = max_carbohydrates
		this.min_proteins = min_proteins
		this.max_proteins = max_proteins
		this.min_fats = min_fats
		this.max_fats = max_fats
		this.min_fiber = min_fiber
		this.max_fiber = max_fiber
		this.min_sugar = min_sugar
		this.max_sugar = max_sugar
		this.min_sodium = min_sodium
		this.max_sodium = max_sodium
		this.is_active = is_active
	}

	@ApiProperty()
	id: number

	@ApiProperty()
	min_calories: number

	@ApiProperty()
	max_calories: number

	@ApiProperty()
	min_carbohydrates: number

	@ApiProperty()
	max_carbohydrates: number

	@ApiProperty()
	min_proteins: number

	@ApiProperty()
	max_proteins: number

	@ApiProperty()
	min_fiber: number

	@ApiProperty()
	max_fiber: number

	@ApiProperty()
	min_fats: number

	@ApiProperty()
	max_fats: number

	@ApiProperty()
	min_sugar: number

	@ApiProperty()
	max_sugar: number

	@ApiProperty()
	min_sodium: number

	@ApiProperty()
	max_sodium: number

	@ApiProperty()
	is_active: boolean

	static fromEntity(menuRequirement: MenuRequirement): MenuRequirementDto {
		const id = menuRequirement.id
		const min_calories = menuRequirement.min_calories
		const max_calories = menuRequirement.max_calories
		const min_carbohydrates = menuRequirement.min_carbohydrates
		const max_carbohydrates = menuRequirement.max_carbohydrates
		const min_proteins = menuRequirement.min_proteins
		const max_proteins = menuRequirement.max_proteins
		const min_fats = menuRequirement.min_fats
		const max_fats = menuRequirement.max_fats
		const min_fiber = menuRequirement.min_fiber
		const max_fiber = menuRequirement.max_fiber
		const min_sugar = menuRequirement.min_sugar
		const max_sugar = menuRequirement.max_sugar
		const min_sodium = menuRequirement.min_sodium
		const max_sodium = menuRequirement.max_sodium
		const is_active = menuRequirement.is_active

		return new MenuRequirementDto(
			id,
			min_calories,
			max_calories,
			min_carbohydrates,
			max_carbohydrates,
			min_proteins,
			max_proteins,
			min_fats,
			max_fats,
			min_fiber,
			max_fiber,
			min_sugar,
			max_sugar,
			min_sodium,
			max_sodium,
			is_active
		)
	}
}
