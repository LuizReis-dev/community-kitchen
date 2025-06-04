import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common'
import { MenuService } from './menu.service'
import { CreateMenuDto } from './dto/create-menu.dto'
import { UpdateMenuDto } from './dto/update-menu.dto'
import { MenuDto } from './dto/menu.dto'
import { ApiOkResponse } from '@nestjs/swagger'
import { UnassignedDailyEventDto } from 'src/daily-event/dto/unassigned-daily-event.dto'
import { DailyEventsVacant } from 'src/daily-event/dto/daily-events-vacant-week.dto'

@Controller('menu')
export class MenuController {
	constructor(private readonly menuService: MenuService) {}

	@Post()
	@ApiOkResponse({ type: MenuDto })
	async create(@Body() createMenuDto: CreateMenuDto) {
		return this.menuService.create(createMenuDto)
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

	@Get('daily-events/unassigned')
	@ApiOkResponse({ type: [UnassignedDailyEventDto] })
	async findUnassignedDailyEvents(): Promise<UnassignedDailyEventDto[]> {
		return this.menuService.findDailyEventsWithoutAnyDay()
  	}

	@Get('daily-events/vacant-days')
	@ApiOkResponse({ type: [DailyEventsVacant] })
	async getDailyEventsVacantDays(): Promise<DailyEventsVacant[]> {
		return this.menuService.findDailyEventsWithAvailableDays();
	}
}
