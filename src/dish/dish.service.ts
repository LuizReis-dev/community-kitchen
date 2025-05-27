import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { CreateDishDto } from './dto/create-dish.dto'
import { DishRepository } from './dish.repository'
import { Food } from '../food/entities/food.entity'
import { Op } from 'sequelize'
import { UpdateDishDto } from './dto/update-dish.dto'
import { DishDto } from './dto/dish.dto'
import { DishNutritionFactsDto } from './dto/dish-nutritionFacts.dto'

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

		if (nutritionFacts.calories <= 600) score += 2
		else if (nutritionFacts.calories <= 700) score += 1

		if (nutritionFacts.sodium <= 400) score += 2
		else if (nutritionFacts.sodium <= 500) score += 1

		if (nutritionFacts.proteins >= 15 && nutritionFacts.proteins <= 28) score += 2
		if (nutritionFacts.carbohydrates <= 80) score += 1
		if (nutritionFacts.fats <= 25) score += 1
		if (nutritionFacts.fiber >= 5) score += 1

		const healthy = score >= 6

		return {
			dish: DishDto.fromEntity(dish),
			healthy,
		}
	}
}
