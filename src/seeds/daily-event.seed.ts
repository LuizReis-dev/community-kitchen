// src/daily-event/seeds/create-daily-events.seed.ts
import { Sequelize } from 'sequelize-typescript';
import { DailyEvent } from 'src/daily-event/entities/daily-event.entity';
import { MenuRequirement } from 'src/menu-requirement/entities/menu-requirement.entity';


export const createDailyEvents = async (sequelize: Sequelize) => {
  const transaction = await sequelize.transaction();
  try {
    
    const menuRequirements = await MenuRequirement.findAll({ transaction });


    const dailyEventsData = [
      {
        name: 'Café da Manhã',
        start_time: '07:00:00',
        end_time: '09:00:00',
        requirement_id: menuRequirements[0]?.id || 1, 
      },
      {
        name: 'Almoço',
        start_time: '12:00:00',
        end_time: '14:00:00',
        requirement_id: menuRequirements[1]?.id || 2, 
      },
      {
        name: 'Jantar',
        start_time: '19:00:00',
        end_time: '21:00:00',
        requirement_id: menuRequirements[0]?.id || 1, 
      },
    ];

    await DailyEvent.bulkCreate(dailyEventsData, { transaction });

    await transaction.commit();
    console.log('Daily Events criados com sucesso no banco!');
  } catch (error) {
    await transaction.rollback();
    console.error('Erro ao criar Daily Events no banco!:', error.message);
    throw error;
  }
};