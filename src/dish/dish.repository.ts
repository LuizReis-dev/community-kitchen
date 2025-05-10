import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDishDto } from './dto/create-dish.dto';
import { Dish } from './entities/dish.entity';
import { DishDto } from './dto/dish.dto';
import { Food } from '../food/entities/food.entity';
import { Op } from 'sequelize';

@Injectable()
export class DishRepository {

  async create(createDishDto: CreateDishDto): Promise<DishDto> {
    const foods = await Food.findAll({
      where: {
        id: {
          [Op.in]: createDishDto.foodIds,
        },
      },
    });
    const dish = await Dish.create({
      name: createDishDto.name,
      description: createDishDto.description,
    });

    await dish.$set('foods', foods);

    dish.foods = foods;

    return DishDto.fromEntity(dish);
  }

  async findAll(): Promise<DishDto[]>{
    const dishes = await Dish.findAll({
      include: [Food]
    });
    return dishes.map(DishDto.fromEntity);
  }

  async findOne(id: number): Promise<DishDto> {
    const dish = await Dish.findByPk(id, {
        include: [Food]
    });

    if (!dish) {
    throw new NotFoundException(`Prato nao encontrado.`);
  }

    return DishDto.fromEntity(dish);
  }
}