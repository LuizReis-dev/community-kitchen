import { ApiProperty } from '@nestjs/swagger';
import { Dish } from '../entities/dish.entity';
import { FoodDto } from 'src/food/dto/food.dto';
import { DishFoodDto } from './dishFood.dto';

export class DishDto {
    @ApiProperty({
        description: 'ID do prato.',
        example: 1,
    })
    id: number;

    @ApiProperty({
        description: 'Nome do prato.',
        example: 'Frango grelhado com salada',
    })
    name: string;

    @ApiProperty({
        description: 'Descrição do prato.',
        example: 'Frango grelhado servido com molho madeira, acompanhado de arroz, feijão e salada.',
        required: false,
    })
    description?: string;

    @ApiProperty({
        description: 'Data de criação do prato.',
        example: '2025-06-01T14:00:00.000Z',
    })
    createdAt: Date;

    @ApiProperty({
        description: 'Data de atualização do prato.',
        example: '2025-06-01T14:00:00.000Z',
    })
    updatedAt: Date;

    @ApiProperty({
        description: 'Lista de alimentos associados ao prato, com suas quantidades e valores nutricionais ajustados.',
        type: [DishFoodDto],
    })
    foods: DishFoodDto[];

    constructor(
        id: number,
        name: string,
        description: string | undefined,
        createdAt: Date,
        updatedAt: Date,
        foods: DishFoodDto[]
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.foods = foods;
    }

    static fromEntity(dish: Dish): DishDto {
        const foods = dish.foods?.map((food: any) => {
            const dishFood = food.DishFood;
            const quantity = dishFood?.quantity ?? 100;
            const factor = quantity / 100;

            if (!food.nutritionFacts) {
                throw new Error(`Informações nutricionais não encontradas para o alimento com ID ${food.id}`);
            }

            const adjustedNutritionFacts = {
                calories: Number(food.nutritionFacts.calories) * factor,
                proteins: Number(food.nutritionFacts.proteins) * factor,
                carbohydrates: Number(food.nutritionFacts.carbohydrates) * factor,
                fats: Number(food.nutritionFacts.fats) * factor,
                fiber: Number(food.nutritionFacts.fiber) * factor,
                sugar: Number(food.nutritionFacts.sugar) * factor,
                sodium: Number(food.nutritionFacts.sodium) * factor,
            };

            return new DishFoodDto(
                food.id,
                food.name,
                adjustedNutritionFacts,
                quantity
            );
        }) ?? [];

        return new DishDto(
            dish.id,
            dish.name,
            dish.description,
            dish.createdAt,
            dish.updatedAt,
            foods
        );
    }
}	