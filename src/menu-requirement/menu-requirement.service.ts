import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
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
		const menuRequirement = await this.menuRequirementRepository.findOne(id)

		if (!menuRequirement)
			throw new NotFoundException('Especificações do menu não foram encontradas!')

		return menuRequirement
	}

	async update(id: number, updateMenuRequirementDto: UpdateMenuRequirementDto) {
		const requirement = await this.menuRequirementRepository.findOne(id)
		if (!requirement) {
			throw new NotFoundException('Especificações do menu não foram encontradas!')
		}

		return this.menuRequirementRepository.update(id, updateMenuRequirementDto)
	}

	async remove(id: number): Promise<void> {
		const menuRequirement = await this.menuRequirementRepository.findOne(id)
		if (!menuRequirement)
			throw new NotFoundException('As especifiações do menu não foram encontrado!')

		if (menuRequirement.isActive == true) {
			throw new BadRequestException(
				'Não é possivel remover essa especificação, pois ela está em uso!'
			)
		}
		return this.menuRequirementRepository.remove(id)
	}

	async findActiveMenuRequirements(): Promise<MenuRequirementDto[]> {
		return await this.menuRequirementRepository.findActiveMenuRequirements()
	}

	async findInactiveMenuRequirements(): Promise<MenuRequirementDto[]> {
  		const menuRequirements = await this.menuRequirementRepository.findInactiveMenuRequirements();
  		return menuRequirements.map(requirement => MenuRequirementDto.fromEntity(requirement));
	}

	async deactivate(id: number): Promise<MenuRequirementDto> {
	return this.menuRequirementRepository.deactivate(id)
	}

	async activate(id: number): Promise<MenuRequirementDto> {
  	return this.menuRequirementRepository.activate(id);
	}

}
