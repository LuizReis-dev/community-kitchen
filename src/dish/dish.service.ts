import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateDishDto } from './dto/create-dish.dto';
import { DishRepository } from './dish.repository';
import { Food } from '../food/entities/food.entity';
import { Op } from 'sequelize';
import { UpdateDishDto } from './dto/update-dish.dto';
import { DishDto } from './dto/dish.dto';

@Injectable()
export class DishService {
  constructor(private readonly dishRepository: DishRepository) {}

  async create(createDishDto: CreateDishDto) {
    if (!CreateDishDto.isValid(createDishDto)) {
      throw new BadRequestException('Dados inválidos.');
    }
    const foods = await Food.findAll({
      where: {
        id: {
          [Op.in]: createDishDto.foodIds,
        },
      },
    });

    if (foods.length !== createDishDto.foodIds.length) {
      throw new BadRequestException('Um ou mais foodIds são inválidos.');
    }
    return this.dishRepository.create(createDishDto);
  }

  findAll(): Promise<DishDto[]> {
    return this.dishRepository.findAll();
  }

  findOne(id: number): Promise<DishDto> {
    return this.dishRepository.findOne(id);
  }

  update(id: number, updateDishDto: UpdateDishDto) {
    return `This action updates a #${id} dish`;
  }

  remove(id: number) {
    return `This action removes a #${id} dish`;
  }
}
