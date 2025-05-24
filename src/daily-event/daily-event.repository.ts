import { BadRequestException, Inject, NotFoundException } from '@nestjs/common'
import { Sequelize } from 'sequelize-typescript'
import { DailyEventDto } from './dto/daily-event.dto'
import { DailyEvent } from './entities/daily-event.entity'
import { UpdateDailyEventDto } from './dto/update-daily-event.dto'
import { MenuRequirement } from 'src/menu-requirement/entities/menu-requirement.entity'

export class DailyEventRepository {
	constructor(@Inject('SEQUELIZE') private sequelize: Sequelize) {}

	async findAll(): Promise<DailyEventDto[]>{
		const dailyEvents = await DailyEvent.findAll({
			include: ['menu_requirement'],
		})
		return dailyEvents.map(DailyEventDto.fromEntity)
	}


	async findOne(id: number): Promise<DailyEventDto> {
		const dailyEvent = await DailyEvent.findByPk(id, {
			include: ['menu_requirement'],
		})

		if (!dailyEvent) throw new NotFoundException('Evento diário nao encontrado!')

		return DailyEventDto.fromEntity(dailyEvent)
	}

	async update(id: number, updateDailyEventDto: UpdateDailyEventDto): Promise<DailyEventDto> {
		const dailyEvent = await DailyEvent.findByPk(id)

		if (!dailyEvent) throw new NotFoundException('Evento diário não encontrado!')

		const transaction = await this.sequelize.transaction()
		try {
			await dailyEvent.update(
				{
					requirement_id: updateDailyEventDto.requirement_id,
					name: updateDailyEventDto.name,
					start_time: updateDailyEventDto.start_time,
					end_time: updateDailyEventDto.end_time,
				},
				{ transaction }
			)

			await transaction.commit()
			return DailyEventDto.fromEntity(dailyEvent)
		} catch {
			await transaction.rollback()
			throw new BadRequestException('Erro ao atualizar o evento diário!')
		}
	}

	async remove(id: number): Promise<void> {
		const dailyEvent = await DailyEvent.findByPk(id)
		if (!dailyEvent) throw new NotFoundException('Evento diário não encontrado!')

		await dailyEvent.destroy()
	}
}
