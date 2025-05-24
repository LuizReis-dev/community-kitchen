import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateDailyEventDto } from './dto/create-daily-event.dto'
import { UpdateDailyEventDto } from './dto/update-daily-event.dto'
import { DailyEventRepository } from './daily-event.repository'
import { DailyEventDto } from './dto/daily-event.dto'

@Injectable()
export class DailyEventService {
	constructor(private readonly dailyEventRepository: DailyEventRepository) {}

	create(createDailyEventDto: CreateDailyEventDto) {
		return 'This action adds a new dailyEvent'
	}

	findAll() {
		return `This action returns all dailyEvent`
	}

	async findOne(id: number): Promise<DailyEventDto> {
		return this.dailyEventRepository.findOne(id)
	}

	async update(id: number, updateDailyEventDto: UpdateDailyEventDto) {
		return this.dailyEventRepository.update(id, updateDailyEventDto)
	}

	remove(id: number) {
		return `This action removes a #${id} dailyEvent`
	}
}
