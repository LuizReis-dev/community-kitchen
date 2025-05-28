import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common'
import { FoodService } from './food.service'
import { CreateFoodDto } from './dto/create-food.dto'
import { UpdateFoodDto } from './dto/update-food.dto'
import { ApiOkResponse, ApiParam, ApiQuery } from '@nestjs/swagger'
import { FoodDto } from './dto/food.dto'

@Controller('foods')
export class FoodController {
	constructor(private readonly foodService: FoodService) {}

	@Post()
	async create(@Body() createFoodDto: CreateFoodDto) {
		return this.foodService.create(createFoodDto)
	}

	@Get()
	async findAll() {
		return this.foodService.findAll()
	}

	@Get(':id')
	async findOne(@Param('id') id: string) {
		return this.foodService.findOne(+id)
	}

	@Put(':id')
	async update(@Param('id') id: string, @Body() updateFoodDto: UpdateFoodDto) {
		return this.foodService.update(+id, updateFoodDto)
	}

	@Delete(':id')
	async remove(@Param('id') id: string) {
		return this.foodService.remove(+id)
	}

	@ApiOkResponse({ type: [FoodDto] })
	@Get('foods-by-max-sugar-amount/:maxSugarAmount')
	async findFoodsByMaxSugarAmount(@Param('maxSugarAmount') maxSugarAmount: number) {
		return this.foodService.findFoodsByMaxSugarAmount(maxSugarAmount)
	}

	@ApiOkResponse({ type: [FoodDto] })
	@Get('foods-by-min-protein-amount/:minProteinAmount')
	async findFoodsByMinProteinAmount(@Param('minProteinAmount') minProteinAmount: number) {
		return this.foodService.findFoodsByMinProteinAmount(minProteinAmount)
	}

	@ApiOkResponse()
	@Get('filter/most-used')
	async findMostUsedFoods(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
		return this.foodService.findMostUsedFoods(page, limit)
	}

	@Get('foods-by-name/:term')
	@ApiOkResponse({ type: [FoodDto] })
	@ApiParam({ name: 'name', type: String, example: 'Tomate' })
	async findFoodsByName(@Param('name') name: string): Promise<FoodDto[]> {
		return this.foodService.findFoodsByName(name)
	}

	@ApiOkResponse()
	@Get('filter/most-caloric')
	async findMostCaloricFoods(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
		return this.foodService.findMostCaloricFoods(page, limit)
	}
}
