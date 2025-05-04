import { Injectable } from "@nestjs/common";
import { CreateFoodDto } from "./dto/create-food.dto";
import { Food } from "./entities/food.entity";
import { NutritionFacts } from "./entities/nutrition-facts.entity";
import { FoodDto } from "./dto/food.dto";

@Injectable()
export class FoodRepository {

    async create(createFoodDto: CreateFoodDto): Promise<FoodDto> {
        const food = await Food.create({
            name: createFoodDto.name
        });

        const nutritionFacts = await NutritionFacts.create({
            ...createFoodDto.nutritionFacts,
            foodId: food.id
        });

        food.nutritionFacts = nutritionFacts;

        return FoodDto.fromEntity(food);
    }
}