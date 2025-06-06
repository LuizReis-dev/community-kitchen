import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { CreateDishDto } from './dto/create-dish.dto'
import { DishRepository } from './dish.repository'
import { Food } from '../food/entities/food.entity'
import { Op } from 'sequelize'
import { UpdateDishDto } from './dto/update-dish.dto'
import { DishDto } from './dto/dish.dto'
import { DishNutritionFactsDto } from './dto/dish-nutritionFacts.dto'
import { NutritionFactsDto } from 'src/food/dto/nutrition-facts.dto'
import { Dish } from './entities/dish.entity'
import { DishNutritionSummaryDto } from './dto/dish-nutrition-sumary.dto'

@Injectable()
export class DishService {
	constructor(private readonly dishRepository: DishRepository) {}

	async create(createDishDto: CreateDishDto) {
	const { name, description, foods } = createDishDto;

	if (!name || !description || !foods?.length) {
		throw new BadRequestException('Insira todos os dados do prato.');
	}

	const foodIds = foods.map(f => f.foodId);

	await this.dishRepository.validateFoodIds(foodIds);

	return this.dishRepository.create(createDishDto);
}


	async findAll(): Promise<DishDto[]> {
		const dishes = this.dishRepository.findAll()
		if ((await dishes).length === 0) {
			throw new NotFoundException('Nenhum prato cadastrado.')
		}
		return this.dishRepository.findAll()
	}

	async findOne(id: number): Promise<DishDto> {
		const dish = await this.dishRepository.findOne(id)

		if (!dish) {
			throw new NotFoundException('Prato não encontrado.')
		}

		return DishDto.fromEntity(dish)
	}

	async update(id: number, updateDishDto: UpdateDishDto) {
		return this.dishRepository.update(id, updateDishDto)
	}

	async patch(id: number, updateDishDto: UpdateDishDto) {
		if (updateDishDto.foods !== undefined) {
			throw new BadRequestException('Não é permitido alterar os ingredientes nem a quantidade do prato.')
		}
		return this.dishRepository.patch(id, updateDishDto)
	}

	async remove(id: number): Promise<void> {
		const dish = await this.dishRepository.findOne(id)

		if (!dish) {
			throw new NotFoundException('Prato não encontrado.')
		}

		await this.dishRepository.remove(dish)
	}

	async findDishesByIds(ids: number[]): Promise<DishDto[]> {
		return await this.dishRepository.findDishesByIds(ids)
	}

	async getDishNutritionFacts(id: number): Promise<DishNutritionSummaryDto> {
        const dish = await this.dishRepository.findDishWithNutritionFacts(id);

        if (!dish) {
            throw new NotFoundException('Prato não encontrado.');
        }

        return DishNutritionSummaryDto.fromEntity(dish);
    }

	async findDishesByDescription(term: string): Promise<DishDto[]> {
		if (!term || term.trim() === '') {
			throw new BadRequestException('Termo de busca não pode ser vazio')
		}

		return this.dishRepository.findDishesByDescription(term)
	}

	async findDishesByName(name: string): Promise<DishDto[]> {
		if (!name || name.trim() === '') {
			throw new BadRequestException('name de busca não pode ser vazio')
		}

		const dishes = await this.dishRepository.findByName(name)

		if (dishes.length === 0) {
    		throw new NotFoundException(`Nenhum prato encontrado com o nome contendo '${name}'`)
  		}

		return dishes.map(DishDto.fromEntity)
	}

	async isDishHealthy(id: number): Promise<{ dish: DishDto; healthy: boolean }> {
		const dish = await this.dishRepository.findDishWithNutritionFacts(id)

		if (!dish) {
			throw new NotFoundException('Prato não encontrado.')
		}

		const { nutritionFacts } = await this.getDishNutritionFacts(id)

		let score = 0

		if (nutritionFacts.calories <= 250) score += 2;
		else if (nutritionFacts.calories <= 350) score += 1;

		if (nutritionFacts.sodium <= 200) score += 2;
		else if (nutritionFacts.sodium <= 300) score += 1;

		if (nutritionFacts.proteins >= 10) score += 2;
		else if (nutritionFacts.proteins >= 5) score += 1;

		if (nutritionFacts.carbohydrates <= 30) score += 2;
		else if (nutritionFacts.carbohydrates <= 60) score += 1;

		if (nutritionFacts.fats <= 10) score += 2;
		else if (nutritionFacts.fats <= 20) score += 1;

		if (nutritionFacts.fiber >= 3) score += 2;
		else if (nutritionFacts.fiber >= 1.5) score += 1;

		const healthy = score >= 8

		return {
			dish: DishDto.fromEntity(dish),
			healthy,
		}
	}

	async listAllHealthyDishes(): Promise<DishDto[]> {
		const dishes = await this.dishRepository.findAllDishesWithNutritionFacts();
		const healthyDishes: DishDto[] = [];

		for (const dish of dishes) {
			const result = await this.isDishHealthy(dish.id);
			if (result.healthy) healthyDishes.push(result.dish);
		}	
		return healthyDishes;
	}

	async getFilteredDishes(params: {
		carbohydrates?: number;
        sodium?: number;
        calories?: number;
        proteins?: number;
        limit?: number;
        offset?: number;
    }): Promise<DishNutritionSummaryDto[]> {
        const { carbohydrates, sodium, calories, proteins, limit = 10, offset = 0 } = params;

        const dishes = await this.dishRepository.findWithNutritionFacts(limit, offset);

        const filteredDishes: DishNutritionSummaryDto[] = [];

        for (const dish of dishes) {
            if (!dish.foods) continue;

            const totalNutritionFacts = new NutritionFactsDto(0, 0, 0, 0, 0, 0, 0);

            for (const food of dish.foods as any[]) {
                const nf = food.nutritionFacts;
                if (!nf) continue;

                const quantity = food.DishFood?.quantity ?? 100;
                const factor = quantity / 100;

                totalNutritionFacts.calories += Number(nf.calories) * factor;
                totalNutritionFacts.proteins += Number(nf.proteins) * factor;
                totalNutritionFacts.carbohydrates += Number(nf.carbohydrates) * factor;
                totalNutritionFacts.fats += Number(nf.fats) * factor;
                totalNutritionFacts.fiber += Number(nf.fiber) * factor;
                totalNutritionFacts.sugar += Number(nf.sugar) * factor;
                totalNutritionFacts.sodium += Number(nf.sodium) * factor;
            }
            let include = true;
            if (calories !== undefined && totalNutritionFacts.calories > calories) {
                include = false;
            }

			if (carbohydrates !== undefined && totalNutritionFacts.carbohydrates > carbohydrates) {
                include = false;
            }

            if (sodium !== undefined && totalNutritionFacts.sodium > sodium) {
                include = false;
            }
            if (proteins !== undefined && totalNutritionFacts.proteins < proteins) {
                include = false;
            }

            if (include) {
                filteredDishes.push(
                    new DishNutritionSummaryDto(
                        dish.id,
                        dish.name,
                        dish.description,
                        totalNutritionFacts,
                    ),
                );
            }
        }
        return filteredDishes;
    }


	async getOrderedDishes(parameter: string): Promise<DishNutritionSummaryDto[]> {
		const validParams = ['calories', 'proteins', 'carbohydrates', 'fats', 'sodium', 'fiber', 'sugar'];

		if (!validParams.includes(parameter)) {
			throw new BadRequestException('Parâmetro inválido para ordenação.');
		}

		const dishes = await this.dishRepository.findAllOrderedByNutricionalParameter();

		if (!dishes || dishes.length === 0) {
			throw new NotFoundException('Nenhum prato encontrado.');
		}

		const summaryDtos = dishes.map(DishNutritionSummaryDto.fromEntity);

		summaryDtos.sort((a, b) => {
			const aValue = (a.nutritionFacts as any)[parameter];
			const bValue = (b.nutritionFacts as any)[parameter];
			return bValue - aValue;
		});

		return summaryDtos;
	}


}
