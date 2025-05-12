import { MenuRequirement } from '../entities/menu-requirement.entity'

export class MenuRequirementDto {
	id: number
	calories: number
	carbohydrates: number
	proteins: number
	fats: number
	fiber: number
	sugar: number
	sodium: number
	isActive: boolean

	constructor(
		id: number,
		calories: number,
		carbohydrates: number,
		proteins: number,
		fats: number,
		fiber: number,
		sugar: number,
		sodium: number,
		isActive: boolean
	) {
		this.id = id
		this.calories = calories
		this.carbohydrates = carbohydrates
		this.proteins = proteins
		this.fats = fats
		this.fiber = fiber
		this.sugar = sugar
		this.sodium = sodium
		this.isActive = isActive
	}

	static fromEntity(menuRequirement: MenuRequirement): MenuRequirementDto {
		return new MenuRequirementDto(
			menuRequirement.id,
			menuRequirement.calories,
			menuRequirement.carbohydrates,
			menuRequirement.proteins,
			menuRequirement.fats,
			menuRequirement.fiber,
			menuRequirement.sugar,
			menuRequirement.sodium,
			menuRequirement.isActive
		)
	}
}
