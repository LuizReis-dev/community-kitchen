// src/menu-requirement/seeds/create-menu-requirements.seed.ts
import { Sequelize } from 'sequelize-typescript';
import { MenuRequirement } from 'src/menu-requirement/entities/menu-requirement.entity';

export const createMenuRequirements = async (sequelize: Sequelize) => {
  const menuRequirementsData = [

    {
      min_calories: 350,
      max_calories: 700,
      min_carbohydrates: 30,
      max_carbohydrates: 90,
      min_proteins: 40,
      max_proteins: 70,
      min_fats: 10,
      max_fats: 30,
      min_fiber: 10,
      max_fiber: 25,
      min_sugar: 0,
      max_sugar: 15,
      min_sodium: 80,
      max_sodium: 800,
    },
    {
      min_calories: 650,
      max_calories: 1500,
      min_carbohydrates: 50,
      max_carbohydrates: 120,
      min_proteins: 30,
      max_proteins: 60,
      min_fats: 15,
      max_fats: 40,
      min_fiber: 8,
      max_fiber: 20,
      min_sugar: 0,
      max_sugar: 25,
      min_sodium: 100,
      max_sodium: 1000,
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