import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { DishService } from './dish.service';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';

@Controller('dishes')
export class DishController {
  constructor(private readonly dishService: DishService) {}

  @Post()
  async create(@Body() createDishDto: CreateDishDto) {
    return this.dishService.create(createDishDto);
  }

  @Get()
  async findAll() {
    return this.dishService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.dishService.findOne(+id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDishDto: UpdateDishDto) {
    return this.dishService.update(+id, updateDishDto);
  }

  @Patch(':id')
  async patch(@Param('id') id: string, @Body() patchUpdateDishDto: UpdateDishDto){
    return this.dishService.patch(+id, patchUpdateDishDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.dishService.remove(+id);
  }
}
