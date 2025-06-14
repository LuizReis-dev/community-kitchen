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
					startTime: createDailyEventDto.startTime,
					endTime: createDailyEventDto.endTime,
					requirementId: createDailyEventDto.requirementId,
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
			include: ['menuRequirement'],
		})
		return dailyEvents.map(event => DailyEventDto.fromEntity(event))
	}

	async findOne(id: number): Promise<DailyEventDto | null> {
		const dailyEvent = await DailyEvent.findByPk(id, {
			include: ['menuRequirement'],
		})

		if (!dailyEvent) return null

		return DailyEventDto.fromEntity(dailyEvent)
	}

	async update(
		id: number,
		updateDailyEventDto: UpdateDailyEventDto
	): Promise<DailyEventDto | null> {
		const dailyEvent = await DailyEvent.findByPk(id)

		if (!dailyEvent) return null

		const transaction = await this.sequelize.transaction()
		try {
			await dailyEvent.update(
				{
					requirementId: updateDailyEventDto.requirementId,
					name: updateDailyEventDto.name,
					startTime: updateDailyEventDto.startTime,
					endTime: updateDailyEventDto.endTime,
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
			if (patchDailyEventDTO.startTime !== undefined) {
				dailyEvent.startTime = patchDailyEventDTO.startTime
			}
			if (patchDailyEventDTO.endTime !== undefined) {
				dailyEvent.endTime = patchDailyEventDTO.endTime
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
		await DailyEvent.destroy({
			where: {
				id: id,
			},
		})
	}

	async findUpcomingEventsToday(): Promise<DailyEventDto[]> {
		const now = new Date()
		const currentTime = now.toTimeString().split(' ')[0]

		const dailyEvents = await DailyEvent.findAll({
			where: {
				endTime: { [Op.gte]: currentTime },
			},
			include: ['menuRequirement'],
		})

		return dailyEvents.map(event => DailyEventDto.fromEntity(event))
	}
}
