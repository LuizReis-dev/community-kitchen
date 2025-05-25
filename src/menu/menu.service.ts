import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateMenuDto } from './dto/create-menu.dto'
import { UpdateMenuDto } from './dto/update-menu.dto'
import { MenuRepository } from './menu.repository'
import { MenuRequirementService } from 'src/menu-requirement/menu-requirement.service'
import { DishService } from 'src/dish/dish.service'
import { NutritionFactsDto } from 'src/food/dto/nutrition-facts.dto'
import { MenuRequirementDto } from 'src/menu-requirement/dto/menu-requirement.dto'

@Injectable()
export class MenuService {
	constructor(
		private readonly menuRepository: MenuRepository,
		private readonly menuRequirementService: MenuRequirementService,
		private readonly dishService: DishService
	) {}
	async create(createMenuDto: CreateMenuDto) {
		const menuRequirement = await this.menuRequirementService.findActiveMenuRequirement()
		if (!menuRequirement)
			throw new BadRequestException('Menu requirement not found, please create one first.')

		const dishes = await this.dishService.findDishesByIds(createMenuDto.dishes)

		if (dishes.length === 0) throw new BadRequestException('No dishes found with the provided IDs.')

		const foods = dishes.flatMap(dish => dish.foods)

		const menuNutritionFacts = foods.reduce((acc, food) => {
			const nutritionFacts = food.nutritionFacts
			return {
				calories: acc.calories ?? 0 + nutritionFacts.calories,
				proteins: acc.proteins ?? 0 + nutritionFacts.proteins,
				carbohydrates: acc.carbohydrates ?? 0 + nutritionFacts.carbohydrates,
				fats: acc.fats ?? 0 + nutritionFacts.fats,
				sodium: acc.sodium ?? 0 + nutritionFacts.sodium,
				fiber: acc.fiber ?? 0 + nutritionFacts.fiber,
				sugar: acc.sugar ?? 0 + nutritionFacts.sugar,
			}
		}, {} as NutritionFactsDto)

		const areRequirementsFulfilled = this.validateMenuRequirements(
			menuNutritionFacts,
			menuRequirement
		)

		if (!areRequirementsFulfilled)
			throw new BadRequestException('Menu does not meet the nutritional requirements.')

		return this.menuRepository.create(createMenuDto)
	}

	async findAll() {
		return this.menuRepository.findAll()
	}

	async findOne(id: number) {
		return this.menuRepository.findOne(id)
	}

	async update(id: number, updateMenuDto: UpdateMenuDto) {
		return this.menuRepository.update(id, updateMenuDto)
	}

	async remove(id: number) {
		return this.menuRepository.remove(id)
	}

	private validateMenuRequirements(
		menuNutritionFacts: NutritionFactsDto,
		menuRequirement: MenuRequirementDto
	) {
		const {
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
		} = menuRequirement

		return (
			menuNutritionFacts.calories >= min_calories &&
			menuNutritionFacts.calories <= max_calories &&
			menuNutritionFacts.carbohydrates >= min_carbohydrates &&
			menuNutritionFacts.carbohydrates <= max_carbohydrates &&
			menuNutritionFacts.proteins >= min_proteins &&
			menuNutritionFacts.proteins <= max_proteins &&
			menuNutritionFacts.fats >= min_fats &&
			menuNutritionFacts.fats <= max_fats &&
			menuNutritionFacts.fiber >= min_fiber &&
			menuNutritionFacts.fiber <= max_fiber &&
			menuNutritionFacts.sugar >= min_sugar &&
			menuNutritionFacts.sugar <= max_sugar &&
			menuNutritionFacts.sodium >= min_sodium &&
			menuNutritionFacts.sodium <= max_sodium
		)
	}
}
