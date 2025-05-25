import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateMenuRequirementDto } from './dto/create-menu-requirement.dto'
import { UpdateMenuRequirementDto } from './dto/update-menu-requirement.dto'
import { MenuRequirementRepository } from './menu-requirement.repository'
import { MenuRequirementDto } from './dto/menu-requirement.dto'

@Injectable()
export class MenuRequirementService {
	constructor(private readonly menuRequirementRepository: MenuRequirementRepository) {}

	async create(createMenuRequirementDto: CreateMenuRequirementDto) {
		return this.menuRequirementRepository.create(createMenuRequirementDto)
	}

	async findAll(): Promise<MenuRequirementDto[]> {
		return this.menuRequirementRepository.findAll()
	}

	async findOne(id: number): Promise<MenuRequirementDto> {
		return this.menuRequirementRepository.findOne(id)
	}

	async update(id: number, updateMenuRequirementDto: UpdateMenuRequirementDto) {
		return this.menuRequirementRepository.update(id, updateMenuRequirementDto)
	}

	async remove(id: number): Promise<void> {
		if ((await this.menuRequirementRepository.findOne(id)).is_active == true) {
			throw new BadRequestException(
				'Não é possivel remover essa especificação, pois ela está em uso!'
			)
		}
		return this.menuRequirementRepository.remove(id)
	}

	async findActiveMenuRequirement(): Promise<MenuRequirementDto> {
		return await this.menuRequirementRepository.findActiveMenuRequirement()
	}
}
