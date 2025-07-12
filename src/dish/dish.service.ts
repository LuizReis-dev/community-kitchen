import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { CreateDishDto } from './dto/create-dish.dto'
import { DishRepository } from './dish.repository'
import { UpdateDishDto } from './dto/update-dish.dto'
import { DishDto } from './dto/dish.dto'
import { DishNutritionSummaryDto } from './dto/dish-nutrition-sumary.dto'
import { DishSummaryDto } from './dto/dish-summary-dto'
import { NutritionFactsDto } from 'src/food/dto/nutrition-facts.dto'
import { DishFoodDto } from './dto/dishFood.dto'
import { Dish } from './entities/dish.entity'

@Injectable()
export class DishService {
	constructor(private readonly dishRepository: DishRepository) {}

	async create(createDishDto: CreateDishDto) {
		const { name, description, foods } = createDishDto

		if (!name || !description || !foods?.length) {
			throw new BadRequestException('Insira todos os dados do prato.')
		}

		const foodIds = foods.map(f => f.foodId)

		await this.dishRepository.validateFoodIds(foodIds)

		return this.dishRepository.create(createDishDto)
	}

	async findAll(): Promise<DishDto[]> {
		const dishes = this.dishRepository.findAll()
		if ((await dishes).length === 0) {
			throw new NotFoundException('Nenhum prato cadastrado.')
		}
		return this.dishRepository.findAll()
	}

	async findOne(id: number): Promise<DishDto> {
		const dish = await this.dishRepository.findOne(id)

		if (!dish) {
			throw new NotFoundException('Prato não encontrado.')
		}

		if (dish.foods == null) throw new NotFoundException('Prato não encontrado.')

		return DishDto.fromEntity(dish)
	}

	async update(id: number, updateDishDto: UpdateDishDto) {
		return this.dishRepository.update(id, updateDishDto)
	}

	async patch(id: number, updateDishDto: UpdateDishDto) {
		if (updateDishDto.foods !== undefined) {
			throw new BadRequestException(
				'Não é permitido alterar os ingredientes nem a quantidade do prato.'
			)
		}
		return this.dishRepository.patch(id, updateDishDto)
	}

	async remove(id: number): Promise<void> {
		const dish = await this.dishRepository.findOne(id)

		if (!dish) {
			throw new NotFoundException('Prato não encontrado.')
		}

		await this.dishRepository.remove(dish)
	}

	async findDishesByIds(ids: number[]): Promise<DishDto[]> {
		return await this.dishRepository.findDishesByIds(ids)
	}

	async getDishNutritionFacts(id: number): Promise<DishNutritionSummaryDto> {
		const dish = await this.dishRepository.findDishWithNutritionFacts(id)

		if (!dish) {
			throw new NotFoundException('Prato não encontrado.')
		}

		return DishNutritionSummaryDto.fromEntity(dish)
	}

	async findDishesByDescription(
		term: string,
		type: 'all' | 'healthy' | 'unhealthy' = 'all',
	): Promise<DishDto[]> {
		if (!term || term.trim() === '') {
			throw new BadRequestException('Termo de busca não pode ser vazio')
		}

		const dishes = await this.dishRepository.findDishesByDescription(term)

		if (dishes.length === 0) {
			throw new NotFoundException(`Nenhum prato encontrado com o termo '${term}'`)
		}

		if (type !== 'all') {
			const healthyChecks = await Promise.all(
				dishes.map(async (dish) => {
					const result = await this.isDishHealthy(dish.id)
					return { dish: result.dish, isHealthy: result.healthy }
				}),
			)

			const filtered = healthyChecks.filter(({ isHealthy }) =>
				type === 'healthy' ? isHealthy : !isHealthy,
			)

			if (filtered.length === 0) {
				throw new NotFoundException(`Nenhum prato ${type === 'healthy' ? 'saudável' : 'não saudável'} encontrado com o termo '${term}'`)
			}

			return filtered.map(({ dish }) => dish)
		}

		return dishes.map(DishDto.fromEntity)
	}


	async findDishesByName(
		name: string,
		type: 'all' | 'healthy' | 'unhealthy' = 'all',
	): Promise<DishDto[]> {
		if (!name || name.trim() === '') {
			throw new BadRequestException('name de busca não pode ser vazio')
		}

		const dishes = await this.dishRepository.findByName(name)

		if (dishes.length === 0) {
			throw new NotFoundException(`Nenhum prato encontrado com o nome contendo '${name}'`)
		}

		if (type !== 'all') {
			const healthyChecks = await Promise.all(
				dishes.map(async (dish) => {
					const result = await this.isDishHealthy(dish.id)
					return { dish: result.dish, isHealthy: result.healthy }
				}),
			)

			const filtered = healthyChecks.filter(({ isHealthy }) =>
				type === 'healthy' ? isHealthy : !isHealthy,
			)

			if (filtered.length === 0) {
				throw new NotFoundException(`Nenhum prato ${type === 'healthy' ? 'saudável' : 'não saudável'} encontrado com o nome '${name}'`)
			}

			return filtered.map(({ dish }) => dish)
		}

		return dishes.map(DishDto.fromEntity)
	}


	async isDishHealthy(id: number): Promise<{ dish: DishDto; healthy: boolean }> {
		const dish = await this.dishRepository.findDishWithNutritionFacts(id)

		if (!dish) {
			throw new NotFoundException('Prato não encontrado.')
		}

		const { nutritionFacts } = await this.getDishNutritionFacts(id)

		let score = 0

		if (nutritionFacts.calories <= 250) score += 2
		else if (nutritionFacts.calories <= 350) score += 1

		if (nutritionFacts.sodium <= 200) score += 2
		else if (nutritionFacts.sodium <= 300) score += 1

		if (nutritionFacts.proteins >= 10) score += 2
		else if (nutritionFacts.proteins >= 5) score += 1

		if (nutritionFacts.carbohydrates <= 30) score += 2
		else if (nutritionFacts.carbohydrates <= 60) score += 1

		if (nutritionFacts.fats <= 10) score += 2
		else if (nutritionFacts.fats <= 20) score += 1

		if (nutritionFacts.fiber >= 3) score += 2
		else if (nutritionFacts.fiber >= 1.5) score += 1

		const healthy = score >= 8

		return {
			dish: DishDto.fromEntity(dish),
			healthy,
		}
	}

	async listAllHealthyDishes(): Promise<DishDto[]> {
		const dishes = await this.dishRepository.findAllDishesWithNutritionFacts()
		const healthyDishes: DishDto[] = []

		for (const dish of dishes) {
			const result = await this.isDishHealthy(dish.id)
			if (result.healthy) healthyDishes.push(result.dish)
		}
		return healthyDishes
	}

	async getFilteredDishes(params: {
		carbohydrates?: number
		sodium?: number
		calories?: number
		proteins?: number
		limit?: number
		offset?: number
		}): Promise<DishSummaryDto[]> {
		const { carbohydrates, sodium, calories, proteins, limit = 10, offset = 0 } = params
		const dishes = await this.dishRepository.findWithNutritionFacts(limit, offset)
		const filteredDishes: DishSummaryDto[] = []

		for (const dish of dishes) {
			const nutritionData = this.calculateDishNutrition(dish)
			if (!nutritionData) continue

			const { foods, totalNutritionFacts } = nutritionData

			let include = true
			if (calories !== undefined && totalNutritionFacts.calories > calories) {
			include = false
			}
			if (carbohydrates !== undefined && totalNutritionFacts.carbohydrates > carbohydrates) {
			include = false
			}
			if (sodium !== undefined && totalNutritionFacts.sodium > sodium) {
			include = false
			}
			if (proteins !== undefined && totalNutritionFacts.proteins < proteins) {
			include = false
			}

			if (include) {
			try {
				const summaryDto = DishSummaryDto.fromEntity(dish, foods)
				filteredDishes.push(summaryDto)
			} catch (error) {
				console.error(`Erro ao processar prato ID ${dish.id}:`, error)
				continue
			}
			}
		}
			return filteredDishes
		}

	async getOrderedDishes(parameter: string): Promise<DishSummaryDto[]> {
	const validParams = [
		'calories',
		'proteins',
		'carbohydrates',
		'fats',
		'fiber',
		'sugar',
		'sodium',
	]

	if (!validParams.includes(parameter)) {
		throw new BadRequestException('Parâmetro inválido para ordenação.')
	}

	const dishes = await this.dishRepository.findAllOrderedByNutricionalParameter()

	if (!dishes || dishes.length === 0) {
		throw new NotFoundException('Nenhum prato encontrado.')
	}

	const summaryDtos: DishSummaryDto[] = []

	for (const dish of dishes) {
		const nutritionData = this.calculateDishNutrition(dish)
		if (!nutritionData) continue

		const { foods, totalNutritionFacts } = nutritionData

		try {
		const summaryDto = DishSummaryDto.fromEntity(dish, foods);
		(summaryDto as any).totalNutritionFacts = totalNutritionFacts
		summaryDtos.push(summaryDto)
		} catch (error) {
		console.error(`Erro ao processar prato ID ${dish.id}:`, error)
		continue
		}
	}

	summaryDtos.sort((a, b) => {
		const aValue = (a as any).totalNutritionFacts[parameter]
		const bValue = (b as any).totalNutritionFacts[parameter]
		return bValue - aValue
	})

	const finalDtos = summaryDtos.map(dto => {
		const { totalNutritionFacts, ...cleanDto } = dto as any
		return cleanDto as DishSummaryDto
	})

	return finalDtos
	}

	private calculateDishNutrition(dish: Dish): { foods: DishFoodDto[], totalNutritionFacts: NutritionFactsDto } | null {
	if (!dish.foods) return null

	const foods: DishFoodDto[] = []
	const totalNutritionFacts = new NutritionFactsDto(0, 0, 0, 0, 0, 0, 0)
	const round1 = (value: number) => Math.round(value * 10) / 10

	for (const food of dish.foods) {
		const nf = food.nutritionFacts
		if (!nf) continue

		const dishFood = (food as any).DishFood
		const quantity = dishFood?.quantity ?? 100
		const factor = quantity / 100

		const adjustedNutritionFacts = {
		calories: round1(Number(nf.calories) * factor),
		proteins: round1(Number(nf.proteins) * factor),
		carbohydrates: round1(Number(nf.carbohydrates) * factor),
		fats: round1(Number(nf.fats) * factor),
		fiber: round1(Number(nf.fiber) * factor),
		sugar: round1(Number(nf.sugar) * factor),
		sodium: round1(Number(nf.sodium) * factor),
		}

		totalNutritionFacts.calories += adjustedNutritionFacts.calories
		totalNutritionFacts.proteins += adjustedNutritionFacts.proteins
		totalNutritionFacts.carbohydrates += adjustedNutritionFacts.carbohydrates
		totalNutritionFacts.fats += adjustedNutritionFacts.fats
		totalNutritionFacts.fiber += adjustedNutritionFacts.fiber
		totalNutritionFacts.sugar += adjustedNutritionFacts.sugar
		totalNutritionFacts.sodium += adjustedNutritionFacts.sodium

		foods.push(new DishFoodDto(food.id, food.name, adjustedNutritionFacts, quantity))
	}

	totalNutritionFacts.calories = round1(totalNutritionFacts.calories)
	totalNutritionFacts.proteins = round1(totalNutritionFacts.proteins)
	totalNutritionFacts.carbohydrates = round1(totalNutritionFacts.carbohydrates)
	totalNutritionFacts.fats = round1(totalNutritionFacts.fats)
	totalNutritionFacts.fiber = round1(totalNutritionFacts.fiber)
	totalNutritionFacts.sugar = round1(totalNutritionFacts.sugar)
	totalNutritionFacts.sodium = round1(totalNutritionFacts.sodium)

	return { foods, totalNutritionFacts }
	}
}
