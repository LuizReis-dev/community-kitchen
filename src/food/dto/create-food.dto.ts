import { NutritionFactsDto } from "./nutrition-facts.dto";

export class CreateFoodDto {
    name: string;
    nutritionFacts: NutritionFactsDto;

    static isValid(obj: CreateFoodDto): boolean {
        if (!obj.name?.trim()) return false;
        return NutritionFactsDto.isValid(obj.nutritionFacts);
    }
}
