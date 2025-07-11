import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Put,
	ParseArrayPipe,
	Query,
	ParseIntPipe,
	ParseFloatPipe,
} from '@nestjs/common'
import { DishService } from './dish.service'
import { CreateDishDto } from './dto/create-dish.dto'
import { UpdateDishDto } from './dto/update-dish.dto'
import { DishDto } from './dto/dish.dto'
import { ApiBearerAuth, ApiOkResponse, ApiParam, ApiQuery } from '@nestjs/swagger'
import { DishNutritionFactsDto } from './dto/dish-nutritionFacts.dto'
import { DishNutritionSummaryDto } from './dto/dish-nutrition-sumary.dto'
import { DishSummaryDto } from './dto/dish-summary-dto'

@Controller('dishes')
@ApiBearerAuth('jwt')
export class DishController {
	constructor(private readonly dishService: DishService) {}

	@Post()
	@ApiOkResponse({ type: DishDto })
	async create(@Body() createDishDto: CreateDishDto) {
		return this.dishService.create(createDishDto)
	}

	@Get('list-all/healthy')
	@ApiOkResponse({ type: [DishDto] })
	async listAllHealthy() {
		return this.dishService.listAllHealthyDishes()
	}

	@Get('dishes-by-ids')
	@ApiOkResponse({ type: [DishDto] })
	@ApiQuery({
		name: 'ids',
		required: true,
		type: [Number],
		description: 'IDs dos pratos a serem buscados (separados por vírgula)',
	})
	async findByIds(
		@Query('ids', new ParseArrayPipe({ items: Number, separator: ',', optional: false }))
		ids: number[]
	) {
		return await this.dishService.findDishesByIds(ids)
	}

	@Get()
	@ApiOkResponse({ type: DishDto })
	async findAll() {
		return this.dishService.findAll()
	}

	@Get(':id')
	@ApiOkResponse({ type: DishDto })
	async findOne(@Param('id') id: string) {
		return this.dishService.findOne(+id)
	}

	@Put(':id')
	@ApiOkResponse({ type: DishDto })
	async update(@Param('id') id: string, @Body() updateDishDto: UpdateDishDto) {
		return this.dishService.update(+id, updateDishDto)
	}

	@Patch(':id')
	@ApiOkResponse({ type: DishDto })
	async patch(@Param('id') id: string, @Body() patchUpdateDishDto: UpdateDishDto) {
		return this.dishService.patch(+id, patchUpdateDishDto)
	}

	@Delete(':id')
	@ApiOkResponse({ type: DishDto })
	async remove(@Param('id') id: string) {
		return this.dishService.remove(+id)
	}

	@Get(':id/nutrition-facts')
	@ApiOkResponse({ type: DishNutritionSummaryDto })
	async getDishNutritionFacts(@Param('id') id: number): Promise<DishNutritionSummaryDto> {
		return this.dishService.getDishNutritionFacts(id)
	}

	@Get('dishes-by-description/:term')
	@ApiOkResponse({ type: [DishDto] })
	@ApiParam({ name: 'term', type: String, example: 'arroz' })
	async searchDishesByTerm(@Param('term') term: string): Promise<DishDto[]> {
		return this.dishService.findDishesByDescription(term)
	}

	@Get('dishes-by-name/:name')
	@ApiOkResponse({ type: [DishDto] })
	@ApiParam({ name: 'name', type: String, example: 'feijoada' })
	async searchDishesByName(@Param('name') name: string): Promise<DishDto[]> {
		return this.dishService.findDishesByName(name)
	}

	@Get(':id/healthy')
	@ApiOkResponse({ type: [DishDto] })
	async isDishHealthy(
		@Param('id', ParseIntPipe) id: number
	): Promise<{ dish: DishDto; healthy: boolean }> {
		return this.dishService.isDishHealthy(id)
	}

	@Get('filtered/by-parameter')
	@ApiOkResponse({ type: [DishSummaryDto] })
	@ApiQuery({
	name: 'carbohydrates',
	required: false,
	type: Number,
	description: 'Máximo de carboidratos (g) total do prato.',
	})
	@ApiQuery({
	name: 'sodium',
	required: false,
	type: Number,
	description: 'Máximo de sódio (mg) total do prato.',
	})
	@ApiQuery({
	name: 'calories',
	required: false,
	type: Number,
	description: 'Máximo de calorias total do prato.',
	})
	@ApiQuery({
	name: 'proteins',
	required: false,
	type: Number,
	description: 'Mínimo de proteínas (g) total do prato.',
	})
	@ApiQuery({
	name: 'limit',
	required: false,
	type: Number,
	description: 'Número máximo de resultados (padrão: 10).',
	example: 10,
	})
	@ApiQuery({
	name: 'offset',
	required: false,
	type: Number,
	description: 'Deslocamento para paginação (padrão: 0).',
	example: 0,
	})
	async getFilteredDishes(
	@Query('carbohydrates', new ParseFloatPipe({ optional: true })) carbohydrates?: number,
	@Query('sodium', new ParseFloatPipe({ optional: true })) sodium?: number,
	@Query('calories', new ParseFloatPipe({ optional: true })) calories?: number,
	@Query('proteins', new ParseFloatPipe({ optional: true })) proteins?: number,
	@Query('limit', new ParseIntPipe({ optional: true })) limit = 10,
	@Query('offset', new ParseIntPipe({ optional: true })) offset = 0
	): Promise<DishSummaryDto[]> {
	return this.dishService.getFilteredDishes({
		carbohydrates,
		sodium,
		calories,
		proteins,
		limit,
		offset,
	})
	}

	@Get('order-by/:parameter')
	@ApiOkResponse({ type: [DishSummaryDto] })
	@ApiParam({
	name: 'parameter',
	description:
		'Parâmetro nutricional para ordenação (calories, proteins, carbohydrates, fats, fiber, sodium e sugar)',
	})
	async getOrderedByParameter(
	@Param('parameter') parameter: string
	): Promise<DishSummaryDto[]> {
	return this.dishService.getOrderedDishes(parameter)
	}
}
