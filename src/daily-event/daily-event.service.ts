import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateDailyEventDto } from './dto/create-daily-event.dto'
import { UpdateDailyEventDto } from './dto/update-daily-event.dto'
import { DailyEventRepository } from './daily-event.repository'
import { DailyEventDto } from './dto/daily-event.dto'
import { Not } from 'sequelize-typescript'
import { MenuRequirement } from 'src/menu-requirement/entities/menu-requirement.entity'

@Injectable()
export class DailyEventService {
	constructor(private readonly dailyEventRepository: DailyEventRepository) {}

	async create(createDailyEventDto: CreateDailyEventDto) {
		const menuRequirement = await MenuRequirement.findOne({
			where: { id: createDailyEventDto.requirement_id },
		});

		if (!menuRequirement) {
			throw new BadRequestException('MenuRequirement com esse ID não existe!')
		}

	return this.dailyEventRepository.create(createDailyEventDto);
	}

	async findAll(): Promise<DailyEventDto[]> {
		const dailyEvents = await this.dailyEventRepository.findAll() 

		if (dailyEvents.length === 0) {
		throw new NotFoundException('Nenhum evento encontrado')
	}
		return dailyEvents;
	}

	async findOne(id: number): Promise<DailyEventDto> {
		return this.dailyEventRepository.findOne(id)
	}

	async update(id: number, updateDailyEventDto: UpdateDailyEventDto) {

		const menuRequirement = await MenuRequirement.findOne({
			where: { id: updateDailyEventDto.requirement_id },
		});

		if (!menuRequirement) {
			throw new BadRequestException('MenuRequirement com esse ID não existe!')
		}
		return this.dailyEventRepository.update(id, updateDailyEventDto)
	}

	async patch(id: number, patchDailyEventDTO: UpdateDailyEventDto){
		if(patchDailyEventDTO.requirement_id !== undefined){
			throw new BadRequestException('Não é permitido alterar o requirement id.')
		}
		return this.dailyEventRepository.patch(id, patchDailyEventDTO)
	}

	async remove(id: number): Promise<void> {
		return this.dailyEventRepository.remove(id)
	}
}
