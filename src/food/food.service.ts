import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateFoodDto } from './dto/create-food.dto'
import { UpdateFoodDto } from './dto/update-food.dto'
import { FoodRepository } from './food.repository'
import { FoodDto } from './dto/food.dto'
import { NutritionFactsDto } from './dto/nutrition-facts.dto'

@Injectable()
export class FoodService {
	constructor(private readonly foodRepository: FoodRepository) {}

	async create(createFoodDto: CreateFoodDto): Promise<FoodDto> {
		if (!CreateFoodDto.isValid(createFoodDto)) {
			throw new BadRequestException('Todos os campos devem estar preenchidos!')
		}

		createFoodDto.nutritionFacts.calories = this.calculateCalories(createFoodDto.nutritionFacts)
		return this.foodRepository.create(createFoodDto)
	}

	async findAll(): Promise<FoodDto[]> {
		return this.foodRepository.findAll()
	}

	async findOne(id: number): Promise<FoodDto> {
		return this.foodRepository.findOne(id)
	}

	async update(id: number, updateFoodDto: UpdateFoodDto): Promise<FoodDto> {
		if (!UpdateFoodDto.isValid(updateFoodDto)) {
			throw new BadRequestException('Todos os campos devem estar preenchidos!')
		}

		updateFoodDto.nutritionFacts.calories = this.calculateCalories(updateFoodDto.nutritionFacts)

		return this.foodRepository.update(id, updateFoodDto)
	}

	async remove(id: number): Promise<void> {
		return this.foodRepository.remove(id)
	}

	async findFoodsByMaxSugarAmount(maxSugarAmount: number): Promise<FoodDto[]> {
		return this.foodRepository.findFoodsByMaxSugarAmount(maxSugarAmount)
	}

	async findFoodsByMinProteinAmount(minProteinAmount: number): Promise<FoodDto[]> {
		return this.foodRepository.findFoodsByMinProteinAmount(minProteinAmount)
	}

	async findMostUsedFoods(page: number, limit: number) {
		return this.foodRepository.findMostUsedFoods(page, limit)
	}

	private calculateCalories(nutritionFacts: NutritionFactsDto): number {
		const calories =
			nutritionFacts.carbohydrates * 4 + nutritionFacts.proteins * 4 + nutritionFacts.fats * 9
		return parseFloat(calories.toFixed(2))
	}

	async findFoodsByName(name: string): Promise<FoodDto[]> {
		return this.foodRepository.findFoodsByName(name)
	}

	async findMostCaloricFoods(page: number, limit: number = 10): Promise<FoodDto[]> {
		return this.foodRepository.findMostCaloricFoods(page, limit)
	}
}
