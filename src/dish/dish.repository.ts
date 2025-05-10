import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDishDto } from './dto/create-dish.dto';
import { Dish } from './entities/dish.entity';
import { DishDto } from './dto/dish.dto';
import { Food } from '../food/entities/food.entity';
import { Op } from 'sequelize';
import { UpdateDishDto } from './dto/update-dish.dto';

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
    throw new NotFoundException("Prato nao encontrado.");
  }

    return DishDto.fromEntity(dish);
  }

  async update(id: number, updateDishDto: UpdateDishDto): Promise<DishDto> {
    const dish = await Dish.findByPk(id, {
            include: [Food]
        });

        if(!dish) throw new NotFoundException("Prato não encontrado!");

        await dish.update({
            name : updateDishDto.name,
            description : updateDishDto.description
        });

        if (updateDishDto.foodIds !== undefined) {

          await (dish as any).$set('foods', []);
          const newFoods = await Food.findAll({ where: { id: updateDishDto.foodIds } });
          await (dish as any).$add('foods', newFoods);
    }
    
    const updatedDish = await Dish.findByPk(id, {
        include: [Food]
    });

    if (!updatedDish) {
    throw new NotFoundException("Erro ao atualizar: prato não encontrado.");
    }
    return DishDto.fromEntity(updatedDish);
  }

  async remove(id: number): Promise<void>{
    const dish = await Dish.findByPk(id);

    if(!dish) throw new NotFoundException("Prato nao encontrado.")
    await dish.destroy();
  }
}