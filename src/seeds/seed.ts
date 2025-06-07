// src/seed.ts
import { sequelize } from './config/sequelize-config.seed';
import { createFoods } from './food.seed';
import { createDishes } from './dish.seed'; 
import { createMenuRequirements } from './menu-requirement.seed';
import { createDailyEvents } from './daily-event.seed';
import { createMenus } from './menu.seed';
import { createCustomers } from './customer.seed';

async function runSeeds() {
  try {
    await sequelize.sync({ alter: true });
    console.log('Banco de dados sincronizado com sucesso!');

    await createFoods(sequelize);
    await createDishes(sequelize);
    await createMenuRequirements(sequelize)
    await createDailyEvents(sequelize)
    await createMenus(sequelize)
    await createCustomers(sequelize)

    console.log('Todas as seeds foram executadas com sucesso!');
  } catch (error) {
    console.error('Erro ao executar as seeds:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

runSeeds();