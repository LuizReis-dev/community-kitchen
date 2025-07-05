import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { CreateMenuRequirementDto } from './dto/create-menu-requirement.dto'
import { Sequelize } from 'sequelize-typescript'
import { MenuRequirementDto } from './dto/menu-requirement.dto'
import { MenuRequirement } from './entities/menu-requirement.entity'
import { UpdateMenuRequirementDto } from './dto/update-menu-requirement.dto'

@Injectable()
export class MenuRequirementRepository {
	constructor(@Inject('SEQUELIZE') private sequelize: Sequelize) {}

	async create(createMenuRequirementDto: CreateMenuRequirementDto): Promise<MenuRequirementDto> {
		const transaction = await this.sequelize.transaction()
		try {
			const menuRequirement = await MenuRequirement.create(
				{ ...createMenuRequirementDto },
				{ transaction }
			)

			await transaction.commit()
			return MenuRequirementDto.fromEntity(menuRequirement)
		} catch (error) {
			console.error(error)
			await transaction.rollback()
			throw new BadRequestException('Erro ao cadastrar especificações do menu')
		}
	}

	async findOne(id: number): Promise<MenuRequirementDto | null> {
		const menuRequirement = await MenuRequirement.findByPk(id)

		if (!menuRequirement) return null

		return MenuRequirementDto.fromEntity(menuRequirement)
	}

	async findAll(): Promise<MenuRequirementDto[]> {
		const menuRequirement = await MenuRequirement.findAll()

		if (!menuRequirement)
			throw new NotFoundException('Especificações do menu não foram encontradas!')

		return menuRequirement.map(requirement => MenuRequirementDto.fromEntity(requirement))
	}

	async update(
		id: number,
		updateMenuRequirement: UpdateMenuRequirementDto
	): Promise<MenuRequirementDto | null> {
		const menuRequirement = await MenuRequirement.findByPk(id)

		if (!menuRequirement) return null

		const transaction = await this.sequelize.transaction()
		try {
			await menuRequirement.update({ ...updateMenuRequirement }, { transaction })

			await transaction.commit()
			return MenuRequirementDto.fromEntity(menuRequirement)
		} catch {
			await transaction.rollback()
			throw new BadRequestException('Erro ao atualizar as especificações do menu!')
		}
	}

	async remove(id: number): Promise<void> {
		await MenuRequirement.destroy({
			where: {
				id: id,
			},
		})
	}

	async findActiveMenuRequirements(): Promise<MenuRequirementDto[]> {
		const menuRequirements = await MenuRequirement.findAll({
			where: {
				isActive: true,
			},
		})

		if (menuRequirements.length === 0)
			throw new NotFoundException('Nenhuma especificação ativa encontrada.')

		return menuRequirements.map(requirement => MenuRequirementDto.fromEntity(requirement))
	}

	async deactivate(id: number): Promise<MenuRequirementDto> {
	const menuRequirement = await MenuRequirement.findByPk(id)

	if (!menuRequirement) {
		throw new NotFoundException('Especificação do menu não encontrada!')
	}

	const transaction = await this.sequelize.transaction()
	try {
		await menuRequirement.update({ isActive: false }, { transaction })
		await transaction.commit()
		return MenuRequirementDto.fromEntity(menuRequirement)
	} catch (error) {
		await transaction.rollback()
		throw new BadRequestException('Erro ao desativar a especificação do menu!')
	}
}

}
