import { Controller, Get, Post, Body, Param, Delete, Put, Patch, Query, Req } from '@nestjs/common'
import { MenuService } from './menu.service'
import { CreateMenuDto } from './dto/create-menu.dto'
import { UpdateMenuDto } from './dto/update-menu.dto'
import { MenuDto } from './dto/menu.dto'
import { DailyEventsVacant } from 'src/daily-event/dto/daily-events-vacant-week.dto'
import { ApiBearerAuth, ApiOkResponse, ApiParam, ApiQuery, getSchemaPath } from '@nestjs/swagger'
import { Public } from 'src/common/decorators/public'
import { WEEK_DAYS } from 'src/common/enums/week-days'

@Controller('menus')
@ApiBearerAuth('jwt')
export class MenuController {
	constructor(private readonly menuService: MenuService) {}

	@Post()
	@ApiOkResponse({ type: MenuDto })
	async create(@Body() createMenuDto: CreateMenuDto, @Req() req: Request) {
		return this.menuService.create(createMenuDto, req)
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

	@Get('daily-events/vacant-days')
	@ApiOkResponse({ type: [DailyEventsVacant] })
	async getDailyEventsVacantDays(): Promise<DailyEventsVacant[]> {
		return this.menuService.findDailyEventsWithAvailableDays()
	}

	@Get('menu-by-daily-event/:dailyEventId')
	@ApiQuery({
		name: 'weekDay',
		enum: WEEK_DAYS,
		required: false,
		description: 'Dia da semana. Deve ser um dos valores do enum WEEK_DAYS.',
	})
	@ApiOkResponse({
		schema: {
			oneOf: [
				{ $ref: getSchemaPath(MenuDto) },
				{ type: 'array', items: { $ref: getSchemaPath(MenuDto) } },
			],
		},
		description: 'Returns a single MenuDto or an array of MenuDto',
	})
	async getMenuByDailyEvent(
		@Param('dailyEventId') dailyEventId: string,
		@Query('weekDay') weekDay?: string
	) {
		return this.menuService.getMenuByDailyEvent(+dailyEventId, weekDay)
	}

	@Patch(':id')
	@ApiOkResponse({ type: String })
	async deactivateMenu(@Param('id') id: string) {
		return this.menuService.deactivateMenu(+id)
	}
}
