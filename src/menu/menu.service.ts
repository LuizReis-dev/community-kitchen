import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateMenuDto } from './dto/create-menu.dto'
import { UpdateMenuDto } from './dto/update-menu.dto'
import { MenuRepository } from './menu.repository'
import { DishService } from 'src/dish/dish.service'
import { NutritionFactsDto } from 'src/food/dto/nutrition-facts.dto'
import { MenuRequirementDto } from 'src/menu-requirement/dto/menu-requirement.dto'
import { DailyEventService } from 'src/daily-event/daily-event.service'
import { DishDto } from 'src/dish/dto/dish.dto'
import { DailyEventRepository } from 'src/daily-event/daily-event.repository'
import { WEEK_DAYS } from 'src/common/enums/week-days'
import { DailyEventsVacant } from 'src/daily-event/dto/daily-events-vacant-week.dto'

@Injectable()
export class MenuService {
	constructor(
		private readonly dailyEventRepository: DailyEventRepository,
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
		const round1 = (value: number) => Math.round(value * 10) / 10

		const menuNutritionFacts = foods.reduce(
			(acc, food: any) => {
				const dishFood = food.DishFood
				const quantity = dishFood?.quantity ?? 100
				const factor = quantity / 100

				if (!food.nutritionFacts) {
					throw new Error(
						`Informações nutricionais não encontradas para o alimento com ID ${food.id}`
					)
				}

				const nutritionFacts = food.nutritionFacts

				return {
					calories: acc.calories + Number(nutritionFacts.calories || 0) * factor,
					proteins: acc.proteins + Number(nutritionFacts.proteins || 0) * factor,
					carbohydrates: acc.carbohydrates + Number(nutritionFacts.carbohydrates || 0) * factor,
					fats: acc.fats + Number(nutritionFacts.fats || 0) * factor,
					sodium: acc.sodium + Number(nutritionFacts.sodium || 0) * factor,
					fiber: acc.fiber + Number(nutritionFacts.fiber || 0) * factor,
					sugar: acc.sugar + Number(nutritionFacts.sugar || 0) * factor,
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

		return {
			calories: round1(menuNutritionFacts.calories),
			proteins: round1(menuNutritionFacts.proteins),
			carbohydrates: round1(menuNutritionFacts.carbohydrates),
			fats: round1(menuNutritionFacts.fats),
			sodium: round1(menuNutritionFacts.sodium),
			fiber: round1(menuNutritionFacts.fiber),
			sugar: round1(menuNutritionFacts.sugar),
		}
	}

	async findDailyEventsWithAvailableDays(): Promise<DailyEventsVacant[]> {
		const allEvents = await this.dailyEventRepository.findAll()
		const assignedDays = await this.menuRepository.findAssignedDaysByDailyEvent()
		const allWeekDays = Object.values(WEEK_DAYS) as WEEK_DAYS[]

		const assignedDaysMap = assignedDays.reduce(
			(map, item) => {
				if (!map[item.dailyEventId]) {
					map[item.dailyEventId] = []
				}
				map[item.dailyEventId].push(item.availableDay)
				return map
			},
			{} as Record<number, WEEK_DAYS[]>
		)

		const result: DailyEventsVacant[] = []

		for (const event of allEvents) {
			const eventAssignedDays = assignedDaysMap[event.id] || []
			const availableDays = allWeekDays.filter(day => !eventAssignedDays.includes(day))
			if (availableDays.length > 0) {
				result.push(DailyEventsVacant.fromDto(event, availableDays))
			}
		}
		return result
	}

	async deactivateMenu(id: number) {
		const result = await this.menuRepository.deactivateMenu(id)

		if (!result) {
			throw new NotFoundException('Menu not found.')
		}

		return result
	}
	async listWeeklyMenus() {
		const result = await this.menuRepository.listWeeklyMenus()

		if (result.length === 0) return new NotFoundException('Menu not found.')

		return result
	}

	async listMenuByWeekDay(weekDay: WEEK_DAYS) {
		const result = await this.menuRepository.listMenuByWeekDay(weekDay)

		if (!result) return new NotFoundException('Menu not found.')

		return result
	}

	async getMenuByDailyEvent(dailyEventId: number, weekDay?: string) {
		const result = weekDay
			? await this.menuRepository.getMenuByDailyEventAndWeekDay(dailyEventId, weekDay)
			: await this.menuRepository.getMenuByDailyEvent(dailyEventId)

		if (!result) return new NotFoundException('Menu not found.')

		return result
	}
}
