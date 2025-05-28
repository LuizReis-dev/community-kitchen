import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { CreateDishDto } from './dto/create-dish.dto'
import { DishRepository } from './dish.repository'
import { Food } from '../food/entities/food.entity'
import { Op } from 'sequelize'
import { UpdateDishDto } from './dto/update-dish.dto'
import { DishDto } from './dto/dish.dto'
import { DishNutritionFactsDto } from './dto/dish-nutritionFacts.dto'
import { NutritionFactsDto } from 'src/food/dto/nutrition-facts.dto'
import { Dish } from './entities/dish.entity'

@Injectable()
export class DishService {
	constructor(private readonly dishRepository: DishRepository) {}

	async create(createDishDto: CreateDishDto) {
		const { name, description, foodIds } = createDishDto

		if (!name || !description || !foodIds?.length) {
			throw new BadRequestException('Insira todos os dados do prato.')
		}

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

		return DishDto.fromEntity(dish)
	}

	async update(id: number, updateDishDto: UpdateDishDto) {
		return this.dishRepository.update(id, updateDishDto)
	}

	async patch(id: number, updateDishDto: UpdateDishDto) {
		if (updateDishDto.foodIds !== undefined) {
			throw new BadRequestException('Não é permitido alterar os ingredientes do prato.')
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

	async getDishNutritionFacts(id: number): Promise<DishNutritionFactsDto> {
		return await this.dishRepository.getDishNutritionFacts(id)
	}

	async findDishesByDescription(term: string): Promise<DishDto[]> {
		if (!term || term.trim() === '') {
			throw new BadRequestException('Termo de busca não pode ser vazio')
		}

		return this.dishRepository.findDishesByDescription(term)
	}

	async findDishesByName(name: string): Promise<DishDto[]> {
		if (!name || name.trim() === '') {
			throw new BadRequestException('name de busca não pode ser vazio')
		}

		const dishes = await this.dishRepository.findByName(name)

		if (dishes.length === 0) {
    		throw new NotFoundException(`Nenhum prato encontrado com o nome contendo '${name}'`)
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

		if (nutritionFacts.calories <= 250) score += 2;
		else if (nutritionFacts.calories <= 350) score += 1;

		if (nutritionFacts.sodium <= 200) score += 2;
		else if (nutritionFacts.sodium <= 300) score += 1;

		if (nutritionFacts.proteins >= 10) score += 2;
		else if (nutritionFacts.proteins >= 5) score += 1;

		if (nutritionFacts.carbohydrates <= 30) score += 2;
		else if (nutritionFacts.carbohydrates <= 60) score += 1;

		if (nutritionFacts.fats <= 10) score += 2;
		else if (nutritionFacts.fats <= 20) score += 1;

		if (nutritionFacts.fiber >= 3) score += 2;
		else if (nutritionFacts.fiber >= 1.5) score += 1;

		const healthy = score >= 8

		return {
			dish: DishDto.fromEntity(dish),
			healthy,
		}
	}

	async listAllHealthyDishes(): Promise<DishDto[]> {
		const dishes = await this.dishRepository.findAllDishesWithNutritionFacts();
		const healthyDishes: DishDto[] = [];

		for (const dish of dishes) {
			const result = await this.isDishHealthy(dish.id);
			if (result.healthy) healthyDishes.push(result.dish);
		}	
		return healthyDishes;
	}

	async getFilteredDishes(params: {
			sodium?: number;
			calories?: number;
			proteins?: number;
			limit?: number;
			offset?: number;
		}): Promise<DishDto[]> {

			const dishes = await this.dishRepository.findAllDishesWithNutritionFacts();

			const filtered = dishes.filter(dish => {
				if (params.sodium !== undefined && sumNutritionParam(dish, 'sodium') > params.sodium) return false;
				if (params.calories !== undefined && sumNutritionParam(dish, 'calories') > params.calories) return false;
				if (params.proteins !== undefined && sumNutritionParam(dish, 'proteins') < params.proteins) return false;

				return true;
			});
			return filtered
				.slice(params.offset ?? 0, (params.offset ?? 0) + (params.limit ?? 10))
				.map(DishDto.fromEntity);
	}


	async getOrderedDishes(parameter: string): Promise<DishDto[]> {
		const validParams = ['calories', 'proteins', 'carbohydrates', 'fats'];

		if (!validParams.includes(parameter))
			throw new BadRequestException('Parâmetro inválido para ordenação.');

		const dishes = await this.dishRepository.findAllDishesWithNutritionFacts();

		return dishes
			.sort((a, b) => {
				const aValue = sumNutritionParam(a, parameter);
				const bValue = sumNutritionParam(b, parameter);
				return bValue - aValue;
			})
			.map(DishDto.fromEntity);
	}
}

	function sumNutritionParam(dish: Dish, param: string): number {
		if (!dish.foods) return 0;

		return dish.foods.reduce((sum, food) => {
			const value = food.nutritionFacts?.[param] ?? 0;
			return sum + Number(value);
		}, 0);
}
