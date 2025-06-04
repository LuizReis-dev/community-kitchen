import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateMenuDto } from './dto/create-menu.dto'
import { UpdateMenuDto } from './dto/update-menu.dto'
import { MenuRepository } from './menu.repository'
import { DishService } from 'src/dish/dish.service'
import { NutritionFactsDto } from 'src/food/dto/nutrition-facts.dto'
import { MenuRequirementDto } from 'src/menu-requirement/dto/menu-requirement.dto'
import { DailyEventService } from 'src/daily-event/daily-event.service'
import { DishDto } from 'src/dish/dto/dish.dto'

@Injectable()
export class MenuService {
	constructor(
		private readonly menuRepository: MenuRepository,
		private readonly dishService: DishService,
		private readonly dailyEventService: DailyEventService
	) {}
	async create(createMenuDto: CreateMenuDto) {
		const dailyEventId = createMenuDto.dailyEventId
		const dailyEvent = await this.dailyEventService.findOne(dailyEventId)

		if (!dailyEvent) throw new BadRequestException('Daily event associated not found.')

		const availableDay = createMenuDto.availableDay
		const isMenuNotUnique = await this.menuRepository.countByDailyEventIdAndAvaibleDay(
			dailyEventId,
			availableDay
		)

		if (isMenuNotUnique)
			throw new BadRequestException(
				'A menu already exists for this daily event on the specified day.'
			)

		const menuRequirement = dailyEvent.requirement
		const dishesIds = createMenuDto.dishes

		const dishes = await this.dishService.findDishesByIds(dishesIds)

		if (dishes.length === 0) throw new BadRequestException('No dishes found with the provided IDs.')

		const menuNutritionFacts = this.getMenuRequirementsFromDishes(dishes)

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
	private getMenuRequirementsFromDishes(dishes: DishDto[]): NutritionFactsDto {
		const foods = dishes.flatMap(dish => dish.foods)

		const menuNutritionFacts = foods.reduce(
			(acc, food) => {
				const nutritionFacts = food.nutritionFacts
				return {
					calories: acc.calories + Number(nutritionFacts.calories || 0),
					proteins: acc.proteins + Number(nutritionFacts.proteins || 0),
					carbohydrates: acc.carbohydrates + Number(nutritionFacts.carbohydrates || 0),
					fats: acc.fats + Number(nutritionFacts.fats || 0),
					sodium: acc.sodium + Number(nutritionFacts.sodium || 0),
					fiber: acc.fiber + Number(nutritionFacts.fiber || 0),
					sugar: acc.sugar + Number(nutritionFacts.sugar || 0),
				}
			},
			{
				calories: 0,
				proteins: 0,
				carbohydrates: 0,
				fats: 0,
				sodium: 0,
				fiber: 0,
				sugar: 0,
			} as NutritionFactsDto
		)

		return menuNutritionFacts
	}

	async deactivateMenu(id: number) {
		const result = await this.menuRepository.deactivateMenu(id)

		if (!result) {
			throw new BadRequestException('Menu not found.')
		}

		return result
	}
}
