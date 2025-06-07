// src/menu/seeds/create-menus.seed.ts
import { Sequelize } from 'sequelize-typescript';
import { WEEK_DAYS } from 'src/common/enums/week-days';
import { DailyEvent } from 'src/daily-event/entities/daily-event.entity';
import { Dish } from 'src/dish/entities/dish.entity';
import { DishMenu } from 'src/menu/entities/dish-menu';
import { Menu } from 'src/menu/entities/menu.entity';
/*import { Menu } from '../entities/menu.entity';
import { DishMenu } from '../entities/dish-menu';
import { Dish } from '../../dish/entities/dish.entity'; // Para buscar os pratos pelo nome
import { DailyEvent } from '../../daily-event/entities/daily-event.entity'; // Para buscar os eventos diários
import { WEEK_DAYS } from '../../common/enums/week-days'; // Importar o enum WEEK_DAYS*/

export const createMenus = async (sequelize: Sequelize) => {
  const transaction = await sequelize.transaction();
  try {

    const allDishes = await Dish.findAll({ transaction });
    const getDishId = (name: string) => {
      const dish = allDishes.find((d) => d.name === name);
      if (!dish) throw new Error(`Prato não encontrado para associação com o menu: ${name}`);
      return dish.id;
    };


    const dailyEvents = await DailyEvent.findAll({ transaction });
    const getDailyEventId = (name: string) => {
      const event = dailyEvents.find((e) => e.name === name);
      if (!event) throw new Error(`Evento diário não encontrado para associação com o menu: ${name}`);
      return event.id;
    };

    const menus = [
      {
        activationDate: new Date(),
        availableDay: WEEK_DAYS.MONDAY,
        createdBy: 'admin1',
        dailyEventName: 'Almoço',
        dishes: [
          'PF de Frango Tradicional',
          'Macarrão à Bolonhesa',
          'Salada Vegana Proteica',
        ],
      },
      {
        activationDate: new Date(),
        availableDay: WEEK_DAYS.WEDNESDAY,
        createdBy: 'admin1',
        dailyEventName: 'Jantar',
        dishes: [
          'Omelete com legumes',
          'Quinoa com legumes',
          'Lentilha com arroz e salada',
        ],
      },
      {
        activationDate: new Date(),
        availableDay: WEEK_DAYS.FRIDAY,
        createdBy: 'admin2',
        dailyEventName: 'Café da Manhã',
        dishes: [
          'Sobremesa de banana da casa',
          'Sanduiche Leve',
          'Wrap vegetariano',
        ],
      },
    ];

    
    const menusToCreate = menus.map(menuData => ({
      activationDate: menuData.activationDate,
      availableDay: menuData.availableDay,
      createdBy: menuData.createdBy,
      dailyEventId: getDailyEventId(menuData.dailyEventName),
    }));

    
    const createdMenus = await Menu.bulkCreate(menusToCreate, { transaction });

    const dishMenusToCreate: { menuId: number; dishId: number; }[] = []; 

    for (let i = 0; i < createdMenus.length; i++) {
      const menu = createdMenus[i];
      const originalMenuData = menus[i];

      originalMenuData.dishes.forEach(dishName => {
        dishMenusToCreate.push({
          menuId: menu.id,
          dishId: getDishId(dishName),
        });
      });
    }

    await DishMenu.bulkCreate(dishMenusToCreate, { transaction });

    await transaction.commit();
    console.log('Menus e suas associações com pratos criados com sucesso no banco!');
  } catch (error) {
    await transaction.rollback();
    console.error('Erro ao criar Menus e suas associações no banco!:', error.message);
    throw error;
  }
};