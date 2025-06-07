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
		this.minCalories = min_calories
		this.maxCalories = max_calories
		this.minCarbohydrates = min_carbohydrates
		this.maxCarbohydrates = max_carbohydrates
		this.minProteins = min_proteins
		this.maxProteins = max_proteins
		this.minFats = min_fats
		this.maxFats = max_fats
		this.minFiber = min_fiber
		this.maxFiber = max_fiber
		this.minSugar = min_sugar
		this.maxSugar = max_sugar
		this.minSodium = min_sodium
		this.maxSodium = max_sodium
		this.isActive = is_active
	}

	@ApiProperty()
	id: number

	@ApiProperty({ example: 200, description: 'Mínimo de calorias em kcal' })
	minCalories: number

	@ApiProperty({ example: 800, description: 'Máximo de calorias em kcal' })
	maxCalories: number

	@ApiProperty({ example: 20, description: 'Mínimo de carboidratos em g' })
	minCarbohydrates: number

	@ApiProperty({ example: 80, description: 'Máximo de carboidratos em g' })
	maxCarbohydrates: number

	@ApiProperty({ example: 5, description: 'Mínimo de proteínas em g' })
	minProteins: number

	@ApiProperty({ example: 30, description: 'Máximo de proteínas em g' })
	maxProteins: number

	@ApiProperty({ example: 2, description: 'Mínimo de fibras em g' })
	minFiber: number

	@ApiProperty({ example: 5, description: 'Máximo de fibras em g' })
	maxFiber: number

	@ApiProperty({ example: 5, description: 'Mínimo de gordura em g' })
	minFats: number

	@ApiProperty({ example: 30, description: 'Máximo de gordura em g' })
	maxFats: number

	@ApiProperty({ example: 0, description: 'Mínimo de açúcar em g' })
	minSugar: number

	@ApiProperty({ example: 20, description: 'Máximo de açúcar em g' })
	maxSugar: number

	@ApiProperty({ example: 50, description: 'Mínimo de sódio em mg' })
	minSodium: number

	@ApiProperty({ example: 500, description: 'Máximo de sódio em mg' })
	maxSodium: number

	@ApiProperty({
		example: true,
		description: 'As especificações devem estar ativas ou desativadas.',
	})
	isActive: boolean

	static fromEntity(menuRequirement: MenuRequirement): MenuRequirementDto {
		const id = menuRequirement.id
		const min_calories = menuRequirement.minCalories
		const max_calories = menuRequirement.maxCalories
		const min_carbohydrates = menuRequirement.minCarbohydrates
		const max_carbohydrates = menuRequirement.maxCarbohydrates
		const min_proteins = menuRequirement.minProteins
		const max_proteins = menuRequirement.maxProteins
		const min_fats = menuRequirement.minFats
		const max_fats = menuRequirement.maxFats
		const min_fiber = menuRequirement.minFiber
		const max_fiber = menuRequirement.maxFiber
		const min_sugar = menuRequirement.minSugar
		const max_sugar = menuRequirement.maxSugar
		const min_sodium = menuRequirement.minSodium
		const max_sodium = menuRequirement.maxSodium
		const is_active = menuRequirement.isActive

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
