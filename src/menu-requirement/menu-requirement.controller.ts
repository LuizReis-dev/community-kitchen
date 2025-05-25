import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { MenuRequirementService } from './menu-requirement.service'
import { CreateMenuRequirementDto } from './dto/create-menu-requirement.dto'
import { UpdateMenuRequirementDto } from './dto/update-menu-requirement.dto'
import { ApiOkResponse } from '@nestjs/swagger'
import { MenuRequirementDto } from './dto/menu-requirement.dto'

@Controller('menu-requirements')
export class MenuRequirementController {
	constructor(private readonly menuRequirementService: MenuRequirementService) {}

	@Post()
	@ApiOkResponse({ type: MenuRequirementDto })
	async create(@Body() createMenuRequirementDto: CreateMenuRequirementDto) {
		return this.menuRequirementService.create(createMenuRequirementDto)
	}

	@Get('get-active-menu-requirement')
	@ApiOkResponse({ type: MenuRequirementDto })
	async findActiveMenuRequirement() {
		return await this.menuRequirementService.findActiveMenuRequirement()
	}

	@Get()
	@ApiOkResponse({ type: MenuRequirementDto })
	findAll() {
		return this.menuRequirementService.findAll()
	}

	@Get(':id')
	@ApiOkResponse({ type: MenuRequirementDto })
	findOne(@Param('id') id: string) {
		return this.menuRequirementService.findOne(+id)
	}

	@Patch(':id')
	@ApiOkResponse({ type: MenuRequirementDto })
	update(@Param('id') id: string, @Body() updateMenuRequirementDto: UpdateMenuRequirementDto) {
		return this.menuRequirementService.update(+id, updateMenuRequirementDto)
	}

	@Delete(':id')
	@ApiOkResponse({ type: MenuRequirementDto })
	remove(@Param('id') id: string) {
		return this.menuRequirementService.remove(+id)
	}
}
