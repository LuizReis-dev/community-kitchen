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

@Injectable()
export class DishRepository {
	constructor(@Inject('SEQUELIZE') private sequelize: Sequelize) {}

	async create(createDishDto: CreateDishDto): Promise<DishDto> {
		const transaction = await this.sequelize.transaction()
		
		try {
			const { name, description, foodIds } = createDishDto

			const foods = await Food.findAll({
			where: {
				id: {
				[Op.in]: foodIds,
				},
			},
			transaction,
			})

			const dish = await Dish.create(
			{ name, description },
			{ transaction }
			)

			await dish.$set('foods', foods, { transaction })
			dish.foods = foods

			await transaction.commit()
			
			return DishDto.fromEntity(dish)

		} catch (error) {
			await transaction.rollback()
			throw error instanceof BadRequestException
			? error
			: new BadRequestException('Erro ao criar o prato: ' + error.message)
		}
	}


	async findAll(): Promise<DishDto[]> {
		const dishes = await Dish.findAll({
			include: [Food],
		})
		return dishes.map(dish => DishDto.fromEntity(dish))
	}

	async findOne(id: number): Promise<Dish | null> {
		return await Dish.findByPk(id, {
			include: [Food],
		})
	}

	async update(id: number, updateDishDto: UpdateDishDto): Promise<DishDto> {
		const transaction = await this.sequelize.transaction()
		try {
			const dish = await Dish.findByPk(id, {
				include: [Food],
				transaction,
			})

			if (!dish) {
				throw new NotFoundException('Prato não encontrado!')
			}

			await dish.update(
				{
					name: updateDishDto.name,
					description: updateDishDto.description,
				},
				{ transaction }
			)

			if (updateDishDto.foodIds !== undefined) {
				const newFoods = await Food.findAll({
					where: { id: updateDishDto.foodIds },
					transaction,
				})

				await dish.$set('foods', newFoods, { transaction })
				dish.foods = newFoods
			}

			const updatedDish = await Dish.findByPk(id, {
				include: [Food],
				transaction,
			})

			if (!updatedDish) {
				throw new NotFoundException('Erro ao atualizar: prato não encontrado.')
			}
			await transaction.commit()
			return DishDto.fromEntity(dish)
		} catch (error) {
			await transaction.rollback()
			throw error instanceof NotFoundException || error instanceof BadRequestException
				? error
				: new BadRequestException('Erro ao atualizar o prato: ' + error.message)
		}
	}

	async patch(id: number, updateDishDto: UpdateDishDto): Promise<DishDto> {
		const transaction = await this.sequelize.transaction()
		try {
			const dish = await Dish.findByPk(id, {
				include: [Food],
				transaction,
			})

			if (!dish) {
				throw new NotFoundException('Prato não encontrado!')
			}
			if (updateDishDto.name !== undefined) {
				dish.name = updateDishDto.name
			}
			if (updateDishDto.description !== undefined) {
				dish.description = updateDishDto.description
			}

			await dish.save({ transaction })
			await transaction.commit()
			return DishDto.fromEntity(dish)
		} catch (error) {
			await transaction.rollback()
			throw error instanceof NotFoundException
				? error
				: new BadRequestException('Erro ao atualizar o prato: ' + error.message)
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
					include: [NutritionFacts],
				},
			],
		})

		return dishes.map(dish => DishDto.fromEntity(dish))
	}

	async getDishNutritionFacts(id: number): Promise<DishNutritionFactsDto> {
		const dish = await Dish.findByPk(id, {
			include: [{ model: Food, include: [NutritionFacts] }],
		})

		if (!dish) {
			throw new NotFoundException('Prato não encontrado.')
		}

		if (!dish.foods) {
			throw new NotFoundException('O prato está incompleto')
		}

		const totalNutritionFacts = new NutritionFactsDto(0, 0, 0, 0, 0, 0, 0)

		for (const food of dish.foods) {
			const nf = food.nutritionFacts
			if (!nf) continue

			totalNutritionFacts.calories += Number(nf.calories)
			totalNutritionFacts.carbohydrates += Number(nf.carbohydrates)
			totalNutritionFacts.proteins += Number(nf.proteins)
			totalNutritionFacts.fats += Number(nf.fats)
			totalNutritionFacts.fiber += Number(nf.fiber)
			totalNutritionFacts.sugar += Number(nf.sugar)
			totalNutritionFacts.sodium += Number(nf.sodium)
		}

		return DishNutritionFactsDto.fromEntity(dish, totalNutritionFacts)
	}

	async findDishesByDescription(term: string): Promise<DishDto[]> {
		const dishes = await Dish.findAll({
			include: [
				{
					model: Food,
				},
			],
			where: {
				description: {
					[Op.iLike]: `%${term}%`,
				},
			},
		})

		if (dishes.length === 0) {
			throw new NotFoundException(`Nenhum prato encontrado com o termo '${term}'`)
		}

		return dishes.map(dish => DishDto.fromEntity(dish))
	}

	async findByName(name: string): Promise<Dish[]> {
		return await Dish.findAll({
			include: [Food],
			where: {
			name: {
				[Op.iLike]: `%${name}%`,
			},
			},
		})
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
