import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common'
import { DailyEventService } from './daily-event.service'
import { CreateDailyEventDto } from './dto/create-daily-event.dto'
import { UpdateDailyEventDto } from './dto/update-daily-event.dto'
import { ApiOkResponse } from '@nestjs/swagger'
import { DailyEventDto } from './dto/daily-event.dto'

@Controller('daily-events')
export class DailyEventController {
	constructor(private readonly dailyEventService: DailyEventService) {}

	@Post()
	@ApiOkResponse({ type: DailyEventDto })
	async create(@Body() createDailyEventDto: CreateDailyEventDto) {
		return this.dailyEventService.create(createDailyEventDto)
	}

	@Get()
	@ApiOkResponse({ type: DailyEventDto })
	async findAll() {
		return this.dailyEventService.findAll()
	}

	@Get(':id')
	@ApiOkResponse({ type: DailyEventDto })
	async findOne(@Param('id') id: string) {
		return this.dailyEventService.findOne(+id)
	}

	@Put(':id')
	@ApiOkResponse({ type: DailyEventDto })
	async update(@Param('id') id: string, @Body() updateDailyEventDto: UpdateDailyEventDto) {
		return this.dailyEventService.update(+id, updateDailyEventDto)
	}

	@Patch(':id')
	@ApiOkResponse({ type: DailyEventDto })
	async patch(@Param('id') id: string, @Body() patchDailyEventDto: UpdateDailyEventDto) {
		return this.dailyEventService.patch(+id, patchDailyEventDto)
	}

	@Delete(':id')
	@ApiOkResponse({ type: DailyEventDto })
	async remove(@Param('id') id: string) {
		return this.dailyEventService.remove(+id)
	}
}
