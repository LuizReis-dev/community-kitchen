// src/menu-requirement/seeds/create-menu-requirements.seed.ts
import { Sequelize } from 'sequelize-typescript';
import { MenuRequirement } from 'src/menu-requirement/entities/menu-requirement.entity';

export const createMenuRequirements = async (sequelize: Sequelize) => {
  const menuRequirementsData = [

    {
      minCalories: 350,
      maxCalories: 700,
      minCarbohydrates: 30,
      maxCarbohydrates: 90,
      minProteins: 40,
      maxProteins: 70,
      minFats: 10,
      maxFats: 30,
      minFiber: 10,
      maxFiber: 25,
      minSugar: 0,
      maxSugar: 15,
      minSodium: 80,
      maxSodium: 800,
    },
    {
      minCalories: 650,
      maxCalories: 1500,
      minCarbohydrates: 50,
      maxCarbohydrates: 120,
      minProteins: 30,
      maxProteins: 60,
      minFats: 15,
      maxFats: 40,
      minFiber: 8,
      maxFiber: 20,
      minSugar: 0,
      maxSugar: 25,
      minSodium: 100,
      maxSodium: 1000,
    },
  ];

  const transaction = await sequelize.transaction();
  try {
    await MenuRequirement.bulkCreate(menuRequirementsData, { transaction });

    await transaction.commit();
    console.log('Menu Requirements criados com sucesso no banco!');
  } catch (error) {
    await transaction.rollback();
    console.error('Erro ao criar Menu Requirements no banco!:', error.message);
    throw error;
  }
};