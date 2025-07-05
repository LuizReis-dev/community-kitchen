import { ApiProperty } from '@nestjs/swagger'
import { MenuRequirement } from '../entities/menu-requirement.entity'

export class MenuRequirementDto {
	constructor(
		id: number,
		minCalories: number,
		maxCalories: number,
		minCarbohydrates: number,
		maxCarbohydrates: number,
		minProteins: number,
		maxProteins: number,
		minFats: number,
		maxFats: number,
		minFiber: number,
		maxFiber: number,
		minSugar: number,
		maxSugar: number,
		minSodium: number,
		maxSodium: number,
		isActive: boolean,
		createdAt: Date,
		updatedAt: Date,
		deletedAt: Date | null
	) {
		this.id = id
		this.minCalories = minCalories
		this.maxCalories = maxCalories
		this.minCarbohydrates = minCarbohydrates
		this.maxCarbohydrates = maxCarbohydrates
		this.minProteins = minProteins
		this.maxProteins = maxProteins
		this.minFats = minFats
		this.maxFats = maxFats
		this.minFiber = minFiber
		this.maxFiber = maxFiber
		this.minSugar = minSugar
		this.maxSugar = maxSugar
		this.minSodium = minSodium
		this.maxSodium = maxSodium
		this.isActive = isActive
		this.createdAt = createdAt
		this.updatedAt = updatedAt
		this.deletedAt = deletedAt

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

	@ApiProperty({
		description: 'Data de criação das especificações.',
		example: '2025-06-01T14:00:00.000Z',
	})
	createdAt: Date

	@ApiProperty({
		description: 'Data de atualização das especificações.',
		example: '2025-06-01T14:00:00.000Z',
	})
	updatedAt: Date

	@ApiProperty({
		description: 'Data de exclusão das especificações.',
		example: '2025-06-01T14:00:00.000Z',
	})
	deletedAt: Date | null

	static fromEntity(menuRequirement: MenuRequirement): MenuRequirementDto {
		const id = menuRequirement.id
		const minCalories = menuRequirement.minCalories
		const maxCalories = menuRequirement.maxCalories
		const minCarbohydrates = menuRequirement.minCarbohydrates
		const maxCarbohydrates = menuRequirement.maxCarbohydrates
		const minProteins = menuRequirement.minProteins
		const maxProteins = menuRequirement.maxProteins
		const minFats = menuRequirement.minFats
		const maxFats = menuRequirement.maxFats
		const minFiber = menuRequirement.minFiber
		const maxFiber = menuRequirement.maxFiber
		const minSugar = menuRequirement.minSugar
		const maxSugar = menuRequirement.maxSugar
		const minSodium = menuRequirement.minSodium
		const maxSodium = menuRequirement.maxSodium
		const isActive = menuRequirement.isActive
    	const createdAt = menuRequirement.createdAt;
    	const updatedAt = menuRequirement.updatedAt;
    	const deletedAt = menuRequirement.deletedAt;

		return new MenuRequirementDto(
			id,
			minCalories,
			maxCalories,
			minCarbohydrates,
			maxCarbohydrates,
			minProteins,
			maxProteins,
			minFats,
			maxFats,
			minFiber,
			maxFiber,
			minSugar,
			maxSugar,
			minSodium,
			maxSodium,
			isActive,
			createdAt,
			updatedAt,
			deletedAt
		)
	}
}
