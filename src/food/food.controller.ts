import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common'
import { FoodService } from './food.service'
import { CreateFoodDto } from './dto/create-food.dto'
import { UpdateFoodDto } from './dto/update-food.dto'
import { ApiBearerAuth, ApiOkResponse, ApiParam, ApiQuery } from '@nestjs/swagger'
import { FoodDto } from './dto/food.dto'
import { NUTRIENTS } from 'src/common/enums/nutrients'

@Controller('foods')
@ApiBearerAuth('jwt')
export class FoodController {
	constructor(private readonly foodService: FoodService) {}

	@Post()
	@ApiOkResponse({ type: [FoodDto] })
	async create(@Body() createFoodDto: CreateFoodDto) {
		return this.foodService.create(createFoodDto)
	}

	@Get()
	@ApiOkResponse({ type: [FoodDto] })
	async findAll() {
		return this.foodService.findAll()
	}

	@Get(':id')
	@ApiOkResponse({ type: [FoodDto] })
	async findOne(@Param('id') id: string) {
		return this.foodService.findOne(+id)
	}

	@Put(':id')
	@ApiOkResponse({ type: [FoodDto] })
	async update(@Param('id') id: string, @Body() updateFoodDto: UpdateFoodDto) {
		return this.foodService.update(+id, updateFoodDto)
	}

	@Delete(':id')
	@ApiOkResponse({ type: [FoodDto] })
	async remove(@Param('id') id: string) {
		return this.foodService.remove(+id)
	}

	@ApiOkResponse({ type: [FoodDto] })
	@ApiQuery({
		name: 'nutrient',
		enum: NUTRIENTS,
		required: false,
		description: 'Nome do nutriente.',
	})
	@Get('foods-by-max-sugar-amount/:maxNutrientAmount')
	async findFoodsByMaxNutrientAmount(
		@Param('maxNutrientAmount') maxNutrientAmount: number,
		@Query('nutrient') nutrient: NUTRIENTS
	) {
		return this.foodService.findFoodsByMaxNutrientAmount(maxNutrientAmount, nutrient)
	}

	@ApiOkResponse({ type: [FoodDto] })
	@ApiQuery({
		name: 'nutrient',
		enum: NUTRIENTS,
		required: false,
		description: 'Nome do nutriente.',
	})
	@Get('foods-by-min-nutrient-amount/:minNutrientAmount')
	async findFoodsByMinNutrientAmount(
		@Param('minNutrientAmount') minNutrientAmount: number,
		@Query('nutrient') nutrient: NUTRIENTS
	) {
		return this.foodService.findFoodsByMinNutrientAmount(minNutrientAmount, nutrient)
	}

	@Get('foods-by-name/:name')
	@ApiOkResponse({ type: [FoodDto] })
	@ApiParam({ name: 'name', type: String, example: 'Tomate' })
	async findFoodsByName(@Param('name') name: string): Promise<FoodDto[]> {
		return this.foodService.findFoodsByName(name)
	}

	@ApiOkResponse({ type: [FoodDto] })
	@Get('filter/most-caloric')
	async findMostCaloricFoods(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
		return this.foodService.findMostCaloricFoods(page, limit)
	}
}
