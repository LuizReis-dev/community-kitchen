import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateDailyEventDto } from './dto/create-daily-event.dto'
import { UpdateDailyEventDto } from './dto/update-daily-event.dto'
import { DailyEventRepository } from './daily-event.repository'
import { DailyEventDto } from './dto/daily-event.dto'
import { MenuRequirement } from 'src/menu-requirement/entities/menu-requirement.entity'
import { DailyEvent } from './entities/daily-event.entity'

@Injectable()
export class DailyEventService {
	constructor(private readonly dailyEventRepository: DailyEventRepository) {}

	async create(createDailyEventDto: CreateDailyEventDto) {
		const menuRequirement = await MenuRequirement.findOne({
			where: { id: createDailyEventDto.requirement_id },
		})

		if (!menuRequirement) {
			throw new BadRequestException('MenuRequirement com esse ID não existe!')
		}

		const existingEvent = await DailyEvent.findOne({
			where: {
				name: createDailyEventDto.name,
				start_time: createDailyEventDto.start_time,
				end_time: createDailyEventDto.end_time,
				requirement_id: createDailyEventDto.requirement_id,
			},
		})

		if (existingEvent) {
			throw new BadRequestException('Já existe um evento com esses dados!')
		}

		return this.dailyEventRepository.create(createDailyEventDto)
	}

	async findAll(): Promise<DailyEventDto[]> {
		const dailyEvents = await this.dailyEventRepository.findAll()

		if (dailyEvents.length === 0) {
			throw new NotFoundException('Nenhum evento encontrado')
		}
		return dailyEvents
	}

	async findOne(id: number): Promise<DailyEventDto> {
        const dailyEvent = await this.dailyEventRepository.findOne(id)

        if (!dailyEvent) throw new NotFoundException('Evento diário nao encontrado!')

        return dailyEvent

	}

	async update(id: number, updateDailyEventDto: UpdateDailyEventDto) {
		const menuRequirement = await MenuRequirement.findOne({
			where: { id: updateDailyEventDto.requirement_id },
		})

		if (!menuRequirement) {
			throw new BadRequestException('MenuRequirement com esse ID não existe!')
		}
		return this.dailyEventRepository.update(id, updateDailyEventDto)
	}

	async patch(id: number, patchDailyEventDTO: UpdateDailyEventDto) {
		if (patchDailyEventDTO.requirement_id !== undefined) {
			throw new BadRequestException('Não é permitido alterar o requirement id.')
		}
		return this.dailyEventRepository.patch(id, patchDailyEventDTO)
	}

	async remove(id: number): Promise<void> {
		const dailyEvent = await DailyEvent.findByPk(id)
        if (!dailyEvent) throw new NotFoundException('Evento diário não encontrado!')

		return this.dailyEventRepository.remove(id)
	}

	async findUpcomingEventsToday(): Promise<DailyEventDto[]> {
		return this.dailyEventRepository.findUpcomingEventsToday()
	}
}
