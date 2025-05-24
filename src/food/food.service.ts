import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateFoodDto } from './dto/create-food.dto'
import { UpdateFoodDto } from './dto/update-food.dto'
import { FoodRepository } from './food.repository'
import { FoodDto } from './dto/food.dto'

@Injectable()
export class FoodService {
	constructor(private readonly foodRepository: FoodRepository) {}

	async create(createFoodDto: CreateFoodDto): Promise<FoodDto> {
		if (!CreateFoodDto.isValid(createFoodDto)) {
			throw new BadRequestException('Todos os campos devem estar preenchidos!')
		}
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
}
