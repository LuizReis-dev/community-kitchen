import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { CreateDishDto } from './dto/create-dish.dto'
import { Dish } from './entities/dish.entity'
import { DishDto } from './dto/dish.dto'
import { Food } from '../food/entities/food.entity'
import { Op } from 'sequelize'
import { UpdateDishDto } from './dto/update-dish.dto'
import { Sequelize } from 'sequelize-typescript'

@Injectable()
export class DishRepository {
	constructor(@Inject('SEQUELIZE') private sequelize: Sequelize) {}

	async create(createDishDto: CreateDishDto): Promise<DishDto> {
		const transaction = await this.sequelize.transaction()
		try {
			const foods = await Food.findAll({
				where: {
					id: {
						[Op.in]: createDishDto.foodIds,
					},
				},
				transaction,
			})

			const dish = await Dish.create(
				{
					name: createDishDto.name,
					description: createDishDto.description,
				},
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

	async findOne(id: number): Promise<DishDto> {
		const dish = await Dish.findByPk(id, {
			include: [Food],
		})

		if (!dish) {
			throw new NotFoundException('Prato nao encontrado.')
		}

		return DishDto.fromEntity(dish)
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

	async remove(id: number): Promise<void> {
		const dish = await Dish.findByPk(id)
		if (!dish) throw new NotFoundException('Prato não encontrado.')
		await dish.destroy()
	}

	async findDishesByIds(ids: number[]): Promise<DishDto[]> {
		const dishes = await Dish.findAll({
			where: {
				id: {
					[Op.in]: ids,
				},
			},
			include: [Food],
		})

		return dishes.map(dish => DishDto.fromEntity(dish))
	}
}
