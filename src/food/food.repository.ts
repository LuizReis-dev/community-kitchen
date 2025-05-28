import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { CreateFoodDto } from './dto/create-food.dto'
import { Food } from './entities/food.entity'
import { NutritionFacts } from './entities/nutrition-facts.entity'
import { FoodDto } from './dto/food.dto'
import { UpdateFoodDto } from './dto/update-food.dto'
import { Sequelize } from 'sequelize-typescript'
import { Op } from 'sequelize'
import { DishFood } from 'src/dish/entities/dish-food.entity'

@Injectable()
export class FoodRepository {
	constructor(@Inject('SEQUELIZE') private sequelize: Sequelize) {}
	async create(createFoodDto: CreateFoodDto): Promise<FoodDto> {
		const transaction = await this.sequelize.transaction()
		try {
			const food = await Food.create(
				{
					name: createFoodDto.name,
				},
				{ transaction }
			)

			const nutritionFacts = await NutritionFacts.create(
				{
					...createFoodDto.nutritionFacts,
					foodId: food.id,
				},
				{ transaction }
			)

			await transaction.commit()
			food.nutritionFacts = nutritionFacts

			return FoodDto.fromEntity(food)
		} catch {
			await transaction.rollback()
			throw new BadRequestException('Erro ao inserir o alimento!')
		}
	}

	async findOne(id: number): Promise<FoodDto> {
		const food = await Food.findByPk(id, {
			include: ['nutritionFacts'],
		})

		if (!food) throw new NotFoundException('Alimento não encontrado!')

		return FoodDto.fromEntity(food)
	}

	async findAll(): Promise<FoodDto[]> {
		const foods = await Food.findAll({
			include: ['nutritionFacts'],
		})

		return foods.map(food => FoodDto.fromEntity(food))
	}

	async remove(id: number): Promise<void> {
		const food = await Food.findByPk(id)

		if (!food) throw new NotFoundException('Alimento não encontrado!')

		await food.destroy()
	}

	async update(id: number, updateFoodDto: UpdateFoodDto): Promise<FoodDto> {
		const food = await Food.findByPk(id, {
			include: ['nutritionFacts'],
		})

		if (!food) throw new NotFoundException('Alimento não encontrado!')

		const transaction = await this.sequelize.transaction()
		try {
			await food.update(
				{
					name: updateFoodDto.name,
				},
				{ transaction }
			)

			await food.nutritionFacts.update(
				{
					...updateFoodDto.nutritionFacts,
				},
				{ transaction }
			)

			await transaction.commit()
			return FoodDto.fromEntity(food)
		} catch {
			await transaction.rollback()
			throw new BadRequestException('Erro ao atualizar o alimento!')
		}
	}

	async findFoodsByMaxSugarAmount(maxSugarAmount: number): Promise<FoodDto[]> {
		const foods = await Food.findAll({
			include: [
				{
					model: NutritionFacts,
					where: {
						sugar: {
							[Op.lte]: maxSugarAmount,
						},
					},
				},
			],
		})

		if (foods.length === 0)
			throw new NotFoundException(`Nenhum alimento encontrado com até ${maxSugarAmount} de açúcar!`)

		return foods.map(food => FoodDto.fromEntity(food))
	}

	async findFoodsByMinProteinAmount(minProteinAmount: number): Promise<FoodDto[]> {
		const foods = await Food.findAll({
			include: [
				{
					model: NutritionFacts,
					where: {
						proteins: {
							[Op.gte]: minProteinAmount,
						},
					},
				},
			],
		})

		if (foods.length === 0)
			throw new NotFoundException(
				`Nenhum alimento encontrado com pelo menos ${minProteinAmount} de proteínas!`
			)

		return foods.map(food => FoodDto.fromEntity(food))
	}

	async findMostUsedFoods(page = 1, limit = 10) {
		const mostUsedFoods = await DishFood.findAll({
			attributes: [
				['food_id', 'foodId'],
				[Sequelize.fn('COUNT', Sequelize.col('food_id')), 'timesInDishes'],
			],
			include: [
				{
					model: Food,
					required: false,
					where: { deletedAt: null },
				},
			],
			group: ['DishFood.food_id', 'food.id'],
			order: [[Sequelize.fn('COUNT', Sequelize.col('food_id')), 'DESC']],
			limit,
			offset: (page - 1) * limit,
		})

		return mostUsedFoods
	}

	async findFoodsByName(name: string): Promise<FoodDto[]> {
		const foods = await Food.findAll({
			include: [{ model: NutritionFacts }],
			where: {
				name: {
					[Op.iLike]: `%${name}%`,
				},
			},
		})

		if (foods.length === 0) {
			throw new NotFoundException(`Nenhuma comida encontrada com o nome: '${name}'`)
		}

		return foods.map(food => FoodDto.fromEntity(food))
	}

	async findMostCaloricFoods(page = 1, limit: number = 10): Promise<FoodDto[]> {
		const foods = await Food.findAll({
			include: [{ model: NutritionFacts, as: 'nutritionFacts' }],
			order: [[{ model: NutritionFacts, as: 'nutritionFacts' }, 'calories', 'DESC']],
			limit,
			offset: (page - 1) * limit,
		})

		if (foods.length === 0) {
			throw new NotFoundException(`Nenhum alimento encontrado.`)
		}

		return foods.map(food => FoodDto.fromEntity(food))
	}
}
