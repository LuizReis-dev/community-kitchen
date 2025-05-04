import { Injectable, NotFoundException } from "@nestjs/common";
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

    async findOne(id: number): Promise<FoodDto> {
        const food = await Food.findByPk(id, {
            include: ["nutritionFacts"]
        });

        if(!food) throw new NotFoundException("Alimento não encontrado!");

        return FoodDto.fromEntity(food);
    }

    async findAll(): Promise<FoodDto[]> {
        const foods = await Food.findAll({
            include: ["nutritionFacts"]
        });

        return foods.map(FoodDto.fromEntity);
    }

    async remove(id: number): Promise<void>  {
        const food = await Food.findByPk(id);

        if(!food) throw new NotFoundException("Alimento não encontrado!");

        await food.destroy();
    }
}