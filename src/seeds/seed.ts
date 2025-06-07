// src/seed.ts
import { sequelize } from './config/sequelize-config.seed';
import { createFoods } from './food.seed';

async function runSeeds() {
  try {
    await sequelize.sync({ alter: true });
    console.log('Banco de dados sincronizado com sucesso!');
    
    await createFoods(sequelize);

    console.log('Todas as seeds foram executadas com sucesso!');
  } catch (error) {
    console.error('Erro ao executar as seeds:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

runSeeds();