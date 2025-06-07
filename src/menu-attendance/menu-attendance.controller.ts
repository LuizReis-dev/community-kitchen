import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus } from '@nestjs/common'
import { MenuAttendanceService } from './menu-attendance.service'
import { CreateMenuAttendanceDto } from './dto/create-menu-attendance.dto'
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger'
import { MenuAttendanceDto } from './dto/menu-attendance.dto'
import { MenuAttendanceAggregationDto } from './dto/menu-attendance-aggregation.dto'

@Controller('menu-attendance')
@ApiBearerAuth('jwt')
export class MenuAttendanceController {
	constructor(private readonly menuAttendanceService: MenuAttendanceService) {}

	@Post()
	@ApiCreatedResponse({ type: MenuAttendanceDto })
	@HttpCode(HttpStatus.CREATED)
	async create(@Body() createMenuAttendanceDto: CreateMenuAttendanceDto) {
		return this.menuAttendanceService.create(createMenuAttendanceDto)
	}

	@Get('/aggregate/by-menu')
	@ApiOkResponse({ type: [MenuAttendanceAggregationDto] })
	async aggregateByMenu() {
		return this.menuAttendanceService.aggregateByMenu()
	}

	@Get()
	@ApiOkResponse({ type: [MenuAttendanceDto] })
	async findAll() {
		return this.menuAttendanceService.findAll()
	}

	@Get(':id')
	@ApiOkResponse({ type: MenuAttendanceDto })
	async findOne(@Param('id') id: string) {
		return this.menuAttendanceService.findOne(+id)
	}

	@Get('/customer/:customerId')
	@ApiOkResponse({ type: [MenuAttendanceDto] })
	async findAllByCustomer(@Param('customerId') customerId: string) {
		return this.menuAttendanceService.findAllByCustomer(+customerId)
	}

	@Get('/menu/:menuId')
	@ApiOkResponse({ type: [MenuAttendanceDto] })
	async findAllByMenu(@Param('menuId') menuId: string) {
		return this.menuAttendanceService.findAllByMenu(+menuId)
	}
}
