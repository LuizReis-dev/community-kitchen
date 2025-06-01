import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { CreateDishDto } from './dto/create-dish.dto'
import { Dish } from './entities/dish.entity'
import { DishDto } from './dto/dish.dto'
import { Food } from '../food/entities/food.entity'
import { Op } from 'sequelize'
import { UpdateDishDto } from './dto/update-dish.dto'
import { Sequelize } from 'sequelize-typescript'
import { NutritionFacts } from 'src/food/entities/nutrition-facts.entity'
import { DishNutritionFactsDto } from './dto/dish-nutritionFacts.dto'
import { NutritionFactsDto } from 'src/food/dto/nutrition-facts.dto'
import { DishFood } from './entities/dish-food.entity'

@Injectable()
@Injectable()
export class DishRepository {
	constructor(@Inject('SEQUELIZE') private sequelize: Sequelize) {}

	async create(createDishDto: CreateDishDto): Promise<DishDto> {
	const transaction = await this.sequelize.transaction();

	try {
		const { name, description, foods } = createDishDto;

		const foodIds = foods.map(f => f.foodId);

		const foundFoods = await Food.findAll({
            where: {
                id: {
                    [Op.in]: foodIds,
                },
            },
            include: [{ model: NutritionFacts }],
            transaction,
        });

		const dish = await Dish.create(
			{ name, description },
			{ transaction }
		);

		for (const { foodId, quantity } of foods) {
			await DishFood.create(
				{
					dishId: dish.id,
					foodId,
					quantity,
				},
				{ transaction }
			);
		}
		dish.foods = foundFoods;

		await transaction.commit();

		return DishDto.fromEntity(dish);
	} catch (error) {
		await transaction.rollback();
		throw error instanceof BadRequestException
			? error
			: new BadRequestException('Erro ao criar o prato: ' + error.message);
	}
}


	async findAll(): Promise<DishDto[]> {
    const dishes = await Dish.findAll({
        include: [
            {
                model: Food,
                include: [{ model: NutritionFacts }],
                through: { attributes: ['quantity'] },
            },
        ],
    });
    return dishes.map(dish => DishDto.fromEntity(dish));
}

	async findOne(id: number): Promise<Dish | null> {
    return await Dish.findByPk(id, {
        include: [
            {
                model: Food,
                include: [{ model: NutritionFacts }],
                through: { attributes: ['quantity'] },
            },
        ],
    });
}

	async update(id: number, updateDishDto: UpdateDishDto): Promise<DishDto> {
        const transaction = await this.sequelize.transaction();
        try {
            const dish = await Dish.findByPk(id, {
                include: [
                    {
                        model: Food,
                        include: [{ model: NutritionFacts }],
                        through: { attributes: ['quantity'] },
                    },
                ],
                transaction,
            });

            if (!dish) {
                throw new NotFoundException('Prato não encontrado!');
            }

            if (updateDishDto.name !== undefined) {
                dish.name = updateDishDto.name;
            }
            if (updateDishDto.description !== undefined) {
                dish.description = updateDishDto.description;
            }
            await dish.save({ transaction });

            if (updateDishDto.foods !== undefined) {
                const foodIds = updateDishDto.foods.map(f => f.foodId);
                const newFoods = await Food.findAll({
                    where: { id: { [Op.in]: foodIds } },
                    include: [{ model: NutritionFacts }],
                    transaction,
                });

                if (newFoods.length !== foodIds.length) {
                    throw new BadRequestException('Um ou mais foodIds fornecidos não existem.');
                }

                if (newFoods.some(food => !food.nutritionFacts)) {
                    throw new BadRequestException('Um ou mais alimentos não possuem informações nutricionais.');
                }
                await DishFood.destroy({
                    where: { dishId: id },
                    transaction,
                });
                for (const { foodId, quantity } of updateDishDto.foods) {
                    await DishFood.create(
                        {
                            dishId: id,
                            foodId,
                            quantity,
                        },
                        { transaction }
                    );
                }
            }
            const updatedDish = await Dish.findByPk(id, {
                include: [
                    {
                        model: Food,
                        include: [{ model: NutritionFacts }],
                        through: { attributes: ['quantity'] },
                    },
                ],
                transaction,
            });

            if (!updatedDish) {
                throw new NotFoundException('Erro ao atualizar: prato não encontrado.');
            }

            await transaction.commit();
            return DishDto.fromEntity(updatedDish);
        } catch (error) {
            await transaction.rollback();
            throw error instanceof NotFoundException || error instanceof BadRequestException
                ? error
                : new BadRequestException('Erro ao atualizar o prato: ' + error.message);
        }
    }

	async patch(id: number, updateDishDto: UpdateDishDto): Promise<DishDto> {
		const transaction = await this.sequelize.transaction();
		try {
			const dish = await Dish.findByPk(id, {
				include: [
					{
						model: Food,
						include: [{ model: NutritionFacts }],
						through: { attributes: ['quantity'] },
					},
				],
				transaction,
			});

			if (!dish) {
				throw new NotFoundException('Prato não encontrado!');
			}

			if (updateDishDto.name !== undefined) {
				dish.name = updateDishDto.name;
			}
			if (updateDishDto.description !== undefined) {
				dish.description = updateDishDto.description;
			}
			if (updateDishDto.foods !== undefined) {
				const foodIds = updateDishDto.foods.map(f => f.foodId);
				const newFoods = await Food.findAll({
					where: { id: { [Op.in]: foodIds } },
					include: [{ model: NutritionFacts }],
					transaction,
				});

				if (newFoods.length !== foodIds.length) {
					throw new BadRequestException('Um ou mais foodIds fornecidos não existem.');
				}

				if (newFoods.some(food => !food.nutritionFacts)) {
					throw new BadRequestException('Um ou mais alimentos não possuem informações nutricionais.');
				}

				await DishFood.destroy({
					where: { dishId: id },
					transaction,
				});

				for (const { foodId, quantity } of updateDishDto.foods) {
					await DishFood.create(
						{
							dishId: id,
							foodId,
							quantity,
						},
						{ transaction }
					);
				}
			}

			await dish.save({ transaction });

			const updatedDish = await Dish.findByPk(id, {
				include: [
					{
						model: Food,
						include: [{ model: NutritionFacts }],
						through: { attributes: ['quantity'] },
					},
				],
				transaction,
			});

			if (!updatedDish) {
				throw new NotFoundException('Erro ao atualizar: prato não encontrado.');
			}

			await transaction.commit();
			return DishDto.fromEntity(updatedDish);
		} catch (error) {
			await transaction.rollback();
			throw error instanceof NotFoundException
				? error
				: new BadRequestException('Erro ao atualizar o prato: ' + error.message);
		}
	}

	async remove(dish: Dish): Promise<void> {
  		await dish.destroy()
	}

	async findDishesByIds(ids: number[]): Promise<DishDto[]> {
    const dishes = await Dish.findAll({
        where: {
            id: {
                [Op.in]: ids,
            },
        },
        include: [
            {
                model: Food,
                include: [{ model: NutritionFacts }],
                through: { attributes: ['quantity'] },
            },
        ],
    });
    return dishes.map(dish => DishDto.fromEntity(dish));
	}

	async getDishNutritionFacts(id: number): Promise<DishNutritionFactsDto> {
		const dish = await Dish.findByPk(id, {
			include: [
				{
					model: Food,
					include: [{ model: NutritionFacts }],
					through: { attributes: ['quantity'] },
				},
			],
		});

		if (!dish) {
			throw new NotFoundException('Prato não encontrado.');
		}

		if (!dish.foods) {
			throw new NotFoundException('O prato está incompleto');
		}

		const totalNutritionFacts = new NutritionFactsDto(0, 0, 0, 0, 0, 0, 0);

		for (const food of dish.foods) {
			const nf = food.nutritionFacts;
			if (!nf) continue;

			const dishFood = (food as any).DishFood;
			const quantity = dishFood?.quantity ?? 100;
			const factor = quantity / 100;

			totalNutritionFacts.calories += Number(nf.calories) * factor;
			totalNutritionFacts.carbohydrates += Number(nf.carbohydrates) * factor;
			totalNutritionFacts.proteins += Number(nf.proteins) * factor;
			totalNutritionFacts.fats += Number(nf.fats) * factor;
			totalNutritionFacts.fiber += Number(nf.fiber) * factor;
			totalNutritionFacts.sugar += Number(nf.sugar) * factor;
			totalNutritionFacts.sodium += Number(nf.sodium) * factor;
		}

		return DishNutritionFactsDto.fromEntity(dish, totalNutritionFacts);
	}

	async findDishesByDescription(term: string): Promise<DishDto[]> {
    const dishes = await Dish.findAll({
        include: [
            {
                model: Food,
                include: [{ model: NutritionFacts }],
                through: { attributes: ['quantity'] },
            },
        ],
        where: {
            description: {
                [Op.iLike]: `%${term}%`,
            },
        },
    });

    if (dishes.length === 0) {
        throw new NotFoundException(`Nenhum prato encontrado com o termo '${term}'`);
    }

    return dishes.map(dish => DishDto.fromEntity(dish));
}

	async findByName(name: string): Promise<Dish[]> {
    return await Dish.findAll({
        include: [
            {
                model: Food,
                include: [{ model: NutritionFacts }],
                through: { attributes: ['quantity'] },
            },
        ],
        where: {
            name: {
                [Op.iLike]: `%${name}%`,
            },
        },
    });
}

	async findDishWithNutritionFacts(id: number): Promise<Dish | null> {
		return await Dish.findByPk(id, {
			include: [{ model: Food, include: [NutritionFacts] }],
		})
	}

	async findAllDishesWithNutritionFacts(): Promise<Dish[]>{
		return await Dish.findAll({
			include: [{model: Food, include: [NutritionFacts]}]
		})
	}

	async findWithFilters(
		whereNutritionFacts: {
			sodium?: { [Op.lte]: number };
			calories?: { [Op.lte]: number };
			proteins?: { [Op.gte]: number };
		},
		limit: number,
		offset: number
		): Promise<Dish[]> {
		return Dish.findAll({
			limit,
			offset,
			include: [{
			model: Food,
			include: [{
				model: NutritionFacts,
				where: whereNutritionFacts,
				attributes: ['sodium', 'calories', 'proteins']
			}],
			attributes: []
			}],
			order: [[{ model: Food, as: 'foods' }, { model: NutritionFacts, as: 'nutritionFacts' }, 'sodium', 'ASC']]
		});
	}

	async findAllOrderedByNutritionFact(
			parameter: 'calories' | 'proteins' | 'carbohydrates' | 'fats'
		): Promise<Dish[]> {
			return Dish.findAll({
				include: [{
					model: Food,
					include: [{
						model: NutritionFacts,
						attributes: ['calories', 'proteins', 'carbohydrates', 'fats']
					}],
					attributes: []
				}],
				order: [[{ model: Food, as: 'foods' }, { model: NutritionFacts, as: 'nutritionFacts' }, parameter, 'DESC']]
			});
	}



	async validateFoodIds(foodIds: number[]): Promise<void> {
		const transaction = await this.sequelize.transaction()
		const foods = await Food.findAll({
			where: {
			id: {
				[Op.in]: foodIds,
			},
			},
			transaction,
		})

		if (foods.length !== foodIds.length) {
			throw new BadRequestException('Um ou mais foodIds são inválidos.')
		}
	}

}
