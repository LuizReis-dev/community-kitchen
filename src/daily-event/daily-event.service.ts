import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateDailyEventDto } from './dto/create-daily-event.dto'
import { UpdateDailyEventDto } from './dto/update-daily-event.dto'
import { DailyEventRepository } from './daily-event.repository'
import { DailyEventDto } from './dto/daily-event.dto'
import { Not } from 'sequelize-typescript'

@Injectable()
export class DailyEventService {
	constructor(private readonly dailyEventRepository: DailyEventRepository) {}

	create(createDailyEventDto: CreateDailyEventDto) {
		return 'This action adds a new dailyEvent'
	}

	async findAll(): Promise<DailyEventDto[]> {
		const dailyEvents = await this.dailyEventRepository.findAll() 

		if (dailyEvents.length === 0) {
		throw new NotFoundException('Nenhum evento encontrado');
	}
		return dailyEvents;
	}

	async findOne(id: number): Promise<DailyEventDto> {
		return this.dailyEventRepository.findOne(id)
	}

	async update(id: number, updateDailyEventDto: UpdateDailyEventDto) {
		return this.dailyEventRepository.update(id, updateDailyEventDto)
	}

	async remove(id: number): Promise<void> {
		return this.dailyEventRepository.remove(id)
	}
}
