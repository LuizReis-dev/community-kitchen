import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { CreateDishDto } from './dto/create-dish.dto'
import { DishRepository } from './dish.repository'
import { Food } from '../food/entities/food.entity'
import { Op } from 'sequelize'
import { UpdateDishDto } from './dto/update-dish.dto'
import { DishDto } from './dto/dish.dto'

@Injectable()
export class DishService {
	constructor(private readonly dishRepository: DishRepository) {}

	async create(createDishDto: CreateDishDto) {
		const foods = await Food.findAll({
			where: {
				id: {
					[Op.in]: createDishDto.foodIds,
				},
			},
		})
		if (foods.length !== createDishDto.foodIds.length) {
			throw new BadRequestException('Um ou mais foodIds são inválidos.')
		}
		const { name, description, foodIds } = createDishDto
		if (!name || !description || !foodIds) {
			throw new BadRequestException('Insira todos os dados do prato.')
		}

		return this.dishRepository.create(createDishDto)
	}

	async findAll(): Promise<DishDto[]> {
		const dishes = this.dishRepository.findAll()
		if ((await dishes).length === 0) {
			throw new NotFoundException('Nenhum prato cadastrado.')
		}
		return this.dishRepository.findAll()
	}

	async findOne(id: number): Promise<DishDto> {
		return this.dishRepository.findOne(id)
	}

	async update(id: number, updateDishDto: UpdateDishDto) {
		return this.dishRepository.update(id, updateDishDto)
	}

	async patch(id: number, updateDishDto: UpdateDishDto) {
		if (updateDishDto.foodIds !== undefined) {
			throw new BadRequestException('Não é permitido alterar os ingredientes do prato.')
		}
		return this.dishRepository.patch(id, updateDishDto)
	}

	async remove(id: number): Promise<void> {
		const dish = await this.dishRepository.findOne(id)
		if (!dish) {
			throw new NotFoundException('Prato não encontrado.')
		}
		await this.dishRepository.remove(id)
	}
}
