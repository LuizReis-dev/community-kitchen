import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { CreateFoodDto } from './dto/create-food.dto'
import { Food } from './entities/food.entity'
import { NutritionFacts } from './entities/nutrition-facts.entity'
import { FoodDto } from './dto/food.dto'
import { UpdateFoodDto } from './dto/update-food.dto'
import { Sequelize } from 'sequelize-typescript'
import { Op } from 'sequelize'
import { NUTRIENTS } from 'src/common/enums/nutrients'

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

	async findFoodsByMaxNutrientAmount(
		maxNutrientAmount: number,
		nutrient: NUTRIENTS
	): Promise<FoodDto[] | null> {
		const foods = await Food.findAll({
			include: [
				{
					model: NutritionFacts,
					where: {
						[nutrient]: {
							[Op.lte]: maxNutrientAmount,
						},
					},
				},
			],
		})

		if (foods.length === 0) return null

		return foods.map(food => FoodDto.fromEntity(food))
	}

	async findFoodsByMinNutrientAmount(
		minNutrientAmount: number,
		nutrient: NUTRIENTS
	): Promise<FoodDto[] | null> {
		const foods = await Food.findAll({
			include: [
				{
					model: NutritionFacts,
					where: {
						[nutrient]: {
							[Op.gte]: minNutrientAmount,
						},
					},
				},
			],
		})

		if (foods.length === 0) return null

		return foods.map(food => FoodDto.fromEntity(food))
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
