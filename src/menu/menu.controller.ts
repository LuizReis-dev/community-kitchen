import { Controller, Get, Post, Body, Param, Delete, Put, Patch } from '@nestjs/common'
import { MenuService } from './menu.service'
import { CreateMenuDto } from './dto/create-menu.dto'
import { UpdateMenuDto } from './dto/update-menu.dto'
import { MenuDto } from './dto/menu.dto'
import { ApiOkResponse, ApiParam } from '@nestjs/swagger'
import { Public } from 'src/common/decorators/public'
import { WEEK_DAYS } from 'src/common/enums/week-days'

@Controller('menu')
export class MenuController {
	constructor(private readonly menuService: MenuService) {}

	@Post()
	@ApiOkResponse({ type: MenuDto })
	async create(@Body() createMenuDto: CreateMenuDto) {
		return this.menuService.create(createMenuDto)
	}

	@Public()
	@ApiOkResponse({ type: [MenuDto] })
	@Get('list-weekly-menus')
	async listWeeklyMenus() {
		return this.menuService.listWeeklyMenus()
	}

	@Public()
	@ApiParam({
		name: 'weekDay',
		enum: WEEK_DAYS,
		required: true,
		description: 'Dia da semana. Deve ser um dos valores do enum WEEK_DAYS.',
	})
	@ApiOkResponse({ type: MenuDto })
	@Get('list-menu-by-week-day/:weekDay')
	async listMenuByWeekDay(@Param('weekDay') weekDay: WEEK_DAYS) {
		return this.menuService.listMenuByWeekDay(weekDay)
	}

	@Get()
	@ApiOkResponse({ type: [MenuDto] })
	async findAll() {
		return this.menuService.findAll()
	}

	@Get(':id')
	@ApiOkResponse({ type: MenuDto })
	async findOne(@Param('id') id: string) {
		return this.menuService.findOne(+id)
	}

	@Put(':id')
	@ApiOkResponse({ type: MenuDto })
	async update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
		return this.menuService.update(+id, updateMenuDto)
	}

	@Delete(':id')
	@ApiOkResponse({ type: String })
	async remove(@Param('id') id: string) {
		return this.menuService.remove(+id)
	}

	@Patch(':id')
	@ApiOkResponse({ type: String })
	async deactivateMenu(@Param('id') id: string) {
		return this.menuService.deactivateMenu(+id)
	}
}
