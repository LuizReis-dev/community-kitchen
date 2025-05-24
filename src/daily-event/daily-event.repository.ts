import { Inject, NotFoundException } from '@nestjs/common'
import { Sequelize } from 'sequelize-typescript'
import { DailyEventDto } from './dto/daily-event.dto'
import { DailyEvent } from './entities/daily-event.entity'

export class DailyEventRepository {
	constructor(@Inject('SEQUELIZE') private sequelize: Sequelize) {}

	async findOne(id: number): Promise<DailyEventDto> {
		const dailyEvent = await DailyEvent.findByPk(id, {
			include: ['menu_requirement'],
		})

		if (!dailyEvent) throw new NotFoundException('Evento diário nao encontrado!')

		return DailyEventDto.fromEntity(dailyEvent)
	}
}
