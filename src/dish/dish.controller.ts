import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common'
import { DishService } from './dish.service'
import { CreateDishDto } from './dto/create-dish.dto'
import { UpdateDishDto } from './dto/update-dish.dto'
import { DishDto } from './dto/dish.dto'
import { ApiOkResponse } from '@nestjs/swagger'

@Controller('dishes')
export class DishController {
	constructor(private readonly dishService: DishService) {}

	@Post()
	@ApiOkResponse({ type: DishDto })
	async create(@Body() createDishDto: CreateDishDto) {
		return this.dishService.create(createDishDto)
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
}
