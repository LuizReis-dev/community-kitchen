import { Injectable } from '@nestjs/common'
import { CreateMenuDto } from './dto/create-menu.dto'
import { UpdateMenuDto } from './dto/update-menu.dto'
import { MenuRepository } from './menu.repository'

@Injectable()
export class MenuService {
	constructor(private readonly menuRepository: MenuRepository) {}
	async create(createMenuDto: CreateMenuDto) {
		return this.menuRepository.create(createMenuDto)
	}

	async findAll() {
		return this.menuRepository.findAll()
	}

	async findOne(id: number) {
		return this.menuRepository.findOne(id)
	}

	async update(id: number, updateMenuDto: UpdateMenuDto) {
		return this.menuRepository.update(id, updateMenuDto)
	}

	async remove(id: number) {
		return this.menuRepository.remove(id)
	}
}
