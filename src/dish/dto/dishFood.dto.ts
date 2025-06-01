    import { ApiProperty } from '@nestjs/swagger';
import { Dish } from '../entities/dish.entity';
import { FoodDto } from 'src/food/dto/food.dto';
import { NutritionFactsDto } from 'src/food/dto/nutrition-facts.dto';

export class DishFoodDto {
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
        description: 'Informações nutricionais do alimento ajustadas pela quantidade (em gramas).',
        type: NutritionFactsDto,
    })
    nutritionFacts: NutritionFactsDto;

    @ApiProperty({
        description: 'Quantidade do alimento no prato (em gramas).',
        example: 200,
    })
    quantity: number;

    constructor(id: number, name: string, nutritionFacts: NutritionFactsDto, quantity: number) {
        this.id = id;
        this.name = name;
        this.nutritionFacts = nutritionFacts;
        this.quantity = quantity;
    }
}