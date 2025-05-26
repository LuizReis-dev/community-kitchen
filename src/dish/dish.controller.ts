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
} from '@nestjs/common'
import { DishService } from './dish.service'
import { CreateDishDto } from './dto/create-dish.dto'
import { UpdateDishDto } from './dto/update-dish.dto'
import { DishDto } from './dto/dish.dto'
import { ApiOkResponse, ApiParam, ApiQuery } from '@nestjs/swagger'
import { DishNutritionFactsDto } from './dto/dish-nutritionFacts.dto'

@Controller('dishes')
export class DishController {
	constructor(private readonly dishService: DishService) {}

	@Post()
	@ApiOkResponse({ type: DishDto })
	async create(@Body() createDishDto: CreateDishDto) {
		return this.dishService.create(createDishDto)
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
	@ApiOkResponse({ type: DishNutritionFactsDto })
	async getDishNutritionFacts(@Param('id') id: number): Promise<DishNutritionFactsDto> {
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
		return this.dishService.findDishesByName(name);
	}

	@Get(':id/healthy')
	async isDishHealthy(@Param('id', ParseIntPipe) id: number): Promise<{ dish: DishDto; healthy: boolean }> {
		return this.dishService.isDishHealthy(id)
	}	
}
