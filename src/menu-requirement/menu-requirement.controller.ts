import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { MenuRequirementService } from './menu-requirement.service'
import { CreateMenuRequirementDto } from './dto/create-menu-requirement.dto'
import { UpdateMenuRequirementDto } from './dto/update-menu-requirement.dto'
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger'
import { MenuRequirementDto } from './dto/menu-requirement.dto'

@Controller('menu-requirements')
@ApiBearerAuth('jwt')
export class MenuRequirementController {
	constructor(private readonly menuRequirementService: MenuRequirementService) {}

	@Post()
	@ApiOkResponse({ type: MenuRequirementDto })
	async create(@Body() createMenuRequirementDto: CreateMenuRequirementDto) {
		return this.menuRequirementService.create(createMenuRequirementDto)
	}

	@Get('get-active-menu-requirements')
	@ApiOkResponse({ type: [MenuRequirementDto] })
	async findActiveMenuRequirements() {
		return await this.menuRequirementService.findActiveMenuRequirements()
	}

	@Get('get-inactive-menu-requirements')
	@ApiOkResponse({ type: [MenuRequirementDto] })
	async findInactiveMenuRequirements() {
		return await this.menuRequirementService.findInactiveMenuRequirements()
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

	@Patch(':id/deactivate')
	@ApiOkResponse({ description: 'Especificação desativada com sucesso.' })
	@ApiNotFoundResponse({ description: 'Especificação não encontrada.' })
	async deactivate(@Param('id') id: string): Promise<MenuRequirementDto> {
		return this.menuRequirementService.deactivate(Number(id))
	}

	@Patch(':id/activate')
	@ApiOkResponse({ description: 'Especificação ativada com sucesso.' })
	@ApiNotFoundResponse({ description: 'Especificação não encontrada.' })
	async activate(@Param('id') id: string): Promise<MenuRequirementDto> {
  		return this.menuRequirementService.activate(Number(id));
	}
}
