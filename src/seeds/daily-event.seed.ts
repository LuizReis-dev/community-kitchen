// src/daily-event/seeds/create-daily-events.seed.ts
import { Sequelize } from 'sequelize-typescript'
import { DailyEvent } from 'src/daily-event/entities/daily-event.entity'
import { MenuRequirement } from 'src/menu-requirement/entities/menu-requirement.entity'

export const createDailyEvents = async (sequelize: Sequelize) => {
	const transaction = await sequelize.transaction()
	try {
		const menuRequirements = await MenuRequirement.findAll({ transaction })

		const dailyEventsData = [
			{
				name: 'Café da Manhã',
				startTime: '07:00:00',
				endTime: '09:00:00',
				requirementId: menuRequirements[0]?.id || 1,
			},
			{
				name: 'Almoço',
				startTime: '12:00:00',
				endTime: '14:00:00',
				requirementId: menuRequirements[1]?.id || 2,
			},
			{
				name: 'Jantar',
				startTime: '19:00:00',
				endTime: '21:00:00',
				requirementId: menuRequirements[0]?.id || 1,
			},
		]

		await DailyEvent.bulkCreate(dailyEventsData, { transaction })

		await transaction.commit()
		console.log('Daily Events criados com sucesso no banco!')
	} catch (error) {
		await transaction.rollback()
		console.error('Erro ao criar Daily Events no banco!:', error.message)
		throw error
	}
}
