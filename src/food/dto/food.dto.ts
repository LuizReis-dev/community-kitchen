import { ApiProperty } from '@nestjs/swagger';
import { NutritionFactsDto } from './nutrition-facts.dto';
import { Food } from '../entities/food.entity';

export class FoodDto {
    @ApiProperty({
        description: 'ID do alimento.',
        example: 1,
    })
    id: number;

    @ApiProperty({
        description: 'Nome do alimento.',
        example: 'Frango grelhado',
    })
    name: string;

    @ApiProperty({
        description: 'Informações nutricionais do alimento.',
        type: NutritionFactsDto,
    })
    nutritionFacts: NutritionFactsDto;

    constructor(id: number, name: string, nutritionFacts: NutritionFactsDto) {
        this.id = id;
        this.name = name;
        this.nutritionFacts = nutritionFacts;
    }

	static fromEntity(food: Food): FoodDto {
        if (!food.nutritionFacts) {
            throw new Error(`Informações nutricionais não encontradas para o alimento com ID ${food.id}`);
        }

        const nutritionFacts = {
            calories: Number(food.nutritionFacts.calories),
            proteins: Number(food.nutritionFacts.proteins),
            carbohydrates: Number(food.nutritionFacts.carbohydrates),
            fats: Number(food.nutritionFacts.fats),
            fiber: Number(food.nutritionFacts.fiber),
            sugar: Number(food.nutritionFacts.sugar),
            sodium: Number(food.nutritionFacts.sodium),
        };

        return new FoodDto(food.id, food.name, nutritionFacts);
    }
}