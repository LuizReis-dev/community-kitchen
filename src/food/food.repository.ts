import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFoodDto } from './dto/create-food.dto';
import { Food } from './entities/food.entity';
import { NutritionFacts } from './entities/nutrition-facts.entity';
import { FoodDto } from './dto/food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class FoodRepository {
  constructor(@Inject('SEQUELIZE') private sequelize: Sequelize) {}
  async create(createFoodDto: CreateFoodDto): Promise<FoodDto> {
    const transaction = await this.sequelize.transaction();
    try {
      const food = await Food.create(
        {
          name: createFoodDto.name,
        },
        { transaction },
      );

      const nutritionFacts = await NutritionFacts.create(
        {
          ...createFoodDto.nutritionFacts,
          foodId: food.id,
        },
        { transaction },
      );

      await transaction.commit();
      food.nutritionFacts = nutritionFacts;

      return FoodDto.fromEntity(food);
    } catch (error) {
      await transaction.rollback();
      throw new BadRequestException('Erro ao inserir o alimento!');
    }
  }

  async findOne(id: number): Promise<FoodDto> {
    const food = await Food.findByPk(id, {
      include: ['nutritionFacts'],
    });

    if (!food) throw new NotFoundException('Alimento não encontrado!');

    return FoodDto.fromEntity(food);
  }

  async findAll(): Promise<FoodDto[]> {
    const foods = await Food.findAll({
      include: ['nutritionFacts'],
    });

    return foods.map(FoodDto.fromEntity);
  }

  async remove(id: number): Promise<void> {
    const food = await Food.findByPk(id);

    if (!food) throw new NotFoundException('Alimento não encontrado!');

    await food.destroy();
  }

  async update(id: number, updateFoodDto: UpdateFoodDto): Promise<FoodDto> {
    const food = await Food.findByPk(id, {
      include: ['nutritionFacts'],
    });

    if (!food) throw new NotFoundException('Alimento não encontrado!');

    const transaction = await this.sequelize.transaction();
    try {
      await food.update(
        {
          name: updateFoodDto.name,
        },
        { transaction },
      );

      await food.nutritionFacts.update(
        {
          ...updateFoodDto.nutritionFacts,
        },
        { transaction },
      );

      await transaction.commit();
      return FoodDto.fromEntity(food);
    } catch (error) {
      await transaction.rollback();
      throw new BadRequestException('Erro ao atualizar o alimento!');
    }
  }
}
