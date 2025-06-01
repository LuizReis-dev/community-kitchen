import { ApiProperty } from '@nestjs/swagger';
import { NutritionFactsDto } from 'src/food/dto/nutrition-facts.dto'; 
import { Dish } from '../entities/dish.entity';

export class DishNutritionSummaryDto {

    @ApiProperty({
        description: 'ID do prato.',
        example: 1,
    })
    id: number;

    @ApiProperty({
        description: 'Nome do prato.',
        example: 'Frango Frito com Quinoa e Abobrinha Cremosa',
    })
    name: string;

    @ApiProperty({
        description: 'Descrição do prato.',
        example: 'Peito de frango com crosta crocante, acompanhado de quinoa cozida e abobrinha frita com molho cremoso light.',
        required: false,
    })
    description?: string;

    @ApiProperty({
        description: 'Valores nutricionais totais do prato, ajustados pela quantidade de cada alimento.',
        type: NutritionFactsDto,
    })
    nutritionFacts: NutritionFactsDto;

    constructor(id: number, name: string, description: string | undefined, nutritionFacts: NutritionFactsDto) {
        this.id = id
        this.name = name;
        this.description = description;
        this.nutritionFacts = nutritionFacts;
    }

    static fromEntity(dish: Dish): DishNutritionSummaryDto {
        if (!dish.foods) {
            throw new Error(`O prato com ID ${dish.id} está incompleto: alimentos não encontrados.`);
        }

        const totalNutritionFacts = new NutritionFactsDto(0, 0, 0, 0, 0, 0, 0);

        for (const food of dish.foods) {
            const nf = food.nutritionFacts;
            if (!nf) {
                throw new Error(`Informações nutricionais não encontradas para o alimento com ID ${food.id}`);
            }

            const dishFood = (food as any).DishFood;
            const quantity = dishFood?.quantity ?? 100;
            const factor = quantity / 100;

            totalNutritionFacts.calories += Number(nf.calories) * factor;
            totalNutritionFacts.proteins += Number(nf.proteins) * factor;
            totalNutritionFacts.carbohydrates += Number(nf.carbohydrates) * factor;
            totalNutritionFacts.fats += Number(nf.fats) * factor;
            totalNutritionFacts.fiber += Number(nf.fiber) * factor;
            totalNutritionFacts.sugar += Number(nf.sugar) * factor;
            totalNutritionFacts.sodium += Number(nf.sodium) * factor;
        }

        return new DishNutritionSummaryDto(dish.id ,dish.name, dish.description, totalNutritionFacts);
    }
}