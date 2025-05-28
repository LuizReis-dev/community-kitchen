import { BadRequestException, Inject, NotFoundException } from '@nestjs/common'
import { Sequelize } from 'sequelize-typescript'
import { DailyEventDto } from './dto/daily-event.dto'
import { DailyEvent } from './entities/daily-event.entity'
import { UpdateDailyEventDto } from './dto/update-daily-event.dto'
import { CreateDailyEventDto } from './dto/create-daily-event.dto'
import { Op } from 'sequelize'

export class DailyEventRepository {
	constructor(@Inject('SEQUELIZE') private sequelize: Sequelize) {}

	async create(createDailyEventDto: CreateDailyEventDto): Promise<DailyEventDto> {
		const transaction = await this.sequelize.transaction()

		try {
			const dailyEvent = await DailyEvent.create(
				{
					name: createDailyEventDto.name,
					start_time: createDailyEventDto.start_time,
					end_time: createDailyEventDto.end_time,
					requirement_id: createDailyEventDto.requirement_id,
				},
				{ transaction }
			)

			await transaction.commit()
			return DailyEventDto.fromEntity(dailyEvent)
		} catch (error) {
			await transaction.rollback()
			throw new BadRequestException('Erro ao criar evento diário: ' + error.message)
		}
	}

	async findAll(): Promise<DailyEventDto[]> {
		const dailyEvents = await DailyEvent.findAll({
			include: ['menu_requirement'],
		})
		return dailyEvents.map(event => DailyEventDto.fromEntity(event))
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

	async patch(id: number, patchDailyEventDTO: UpdateDailyEventDto): Promise<DailyEventDto> {
		const transaction = await this.sequelize.transaction()

		try {
			const dailyEvent = await DailyEvent.findByPk(id, { transaction })

			if (!dailyEvent) {
				throw new NotFoundException('Evento diário não encontrado!')
			}

			if (patchDailyEventDTO.name !== undefined) {
				dailyEvent.name = patchDailyEventDTO.name
			}
			if (patchDailyEventDTO.start_time !== undefined) {
				dailyEvent.start_time = patchDailyEventDTO.start_time
			}
			if (patchDailyEventDTO.end_time !== undefined) {
				dailyEvent.end_time = patchDailyEventDTO.end_time
			}
			await dailyEvent.save({ transaction })
			await transaction.commit()

			return DailyEventDto.fromEntity(dailyEvent)
		} catch (error) {
			await transaction.rollback()
			throw error instanceof NotFoundException
				? error
				: new BadRequestException(
						'Erro ao atualizar parcialmente o evento diário: ' + error.message
					)
		}
	}

	async remove(id: number): Promise<void> {
		const dailyEvent = await DailyEvent.findByPk(id)
		if (!dailyEvent) throw new NotFoundException('Evento diário não encontrado!')

		await dailyEvent.destroy()
	}

	async findUpcomingEventsToday(): Promise<DailyEventDto[]> {
		const now = new Date()
		const currentTime = now.toTimeString().split(' ')[0]

		const dailyEvents = await DailyEvent.findAll({
			where: {
				end_time: { [Op.gte]: currentTime },
			},
			include: ['menu_requirement'],
		})

		return dailyEvents.map(event => DailyEventDto.fromEntity(event))
	}
}
