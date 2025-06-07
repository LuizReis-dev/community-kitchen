import { Sequelize } from 'sequelize-typescript';
import { Food } from 'src/food/entities/food.entity';
import { NutritionFacts } from 'src/food/entities/nutrition-facts.entity';

export const createFoods = async (sequelize: Sequelize) => {

  function calculateCalories(carbohydrates: number, proteins: number, fats: number): number {
    const calories = carbohydrates * 4 + proteins * 4 + fats * 9;
    return parseFloat(calories.toFixed(2));
  }

  const foodData = [
    { name: 'Arroz integral', carbohydrates: 23, proteins: 2.6, fats: 0.9, fiber: 1.8, sugar: 0.2, sodium: 1,},
    { name: 'Feijão carioca', carbohydrates: 23, proteins: 8.7, fats: 0.5, fiber: 8.5, sugar: 0.3, sodium: 2 },
    { name: 'Frango grelhado', calories: 165, carbohydrates: 0, proteins: 31, fats: 3.6, fiber: 0, sugar: 0, sodium: 70 },
    { name: 'Alface', carbohydrates: 2.9, proteins: 1.4, fats: 0.2, fiber: 1.3, sugar: 0.8, sodium: 10 },
    { name: 'Tomate', carbohydrates: 3.9, proteins: 0.9, fats: 0.2, fiber: 1.2, sugar: 2.6, sodium: 5 },
    { name: 'Ovo cozido', carbohydrates: 0.6, proteins: 5.5, fats: 4.8, fiber: 0, sugar: 0.6, sodium: 62 },
    { name: 'Batata doce', carbohydrates: 20, proteins: 1.6, fats: 0.1, fiber: 3, sugar: 4.2, sodium: 55 },
    { name: 'Carne moída', carbohydrates: 0, proteins: 26, fats: 17, fiber: 0, sugar: 0, sodium: 75 },
    { name: 'Cenoura cozida', carbohydrates: 8.2, proteins: 0.8, fats: 0.2, fiber: 2.9, sugar: 3.6, sodium: 50 },
    { name: 'Abobrinha', carbohydrates: 3.1, proteins: 1.2, fats: 0.3, fiber: 1.0, sugar: 2.5, sodium: 8 },
    { name: 'Macarrão integral', carbohydrates: 26, proteins: 5, fats: 0.9, fiber: 1.8, sugar: 0.7, sodium: 1 },
    { name: 'Molho de tomate', carbohydrates: 8, proteins: 1.5, fats: 0.5, fiber: 1.7, sugar: 5.6, sodium: 260 },
    { name: 'Tofu', carbohydrates: 1.9, proteins: 8, fats: 4.8, fiber: 0.3, sugar: 0.6, sodium: 7 },
    { name: 'Grão de bico', carbohydrates: 27, proteins: 9, fats: 2.6, fiber: 7.6, sugar: 4.8, sodium: 24 },
    { name: 'Espinafre', carbohydrates: 3.6, proteins: 2.9, fats: 0.4, fiber: 2.2, sugar: 0.4, sodium: 79 },
    { name: 'Quinoa cozida', carbohydrates: 21, proteins: 4.1, fats: 1.9, fiber: 2.8, sugar: 0.9, sodium: 7 },
    { name: 'Lentilha', carbohydrates: 20, proteins: 9, fats: 0.4, fiber: 8, sugar: 1.8, sodium: 2 },
    { name: 'Repolho roxo', carbohydrates: 7, proteins: 1.4, fats: 0.2, fiber: 2.1, sugar: 3.8, sodium: 18 },
    { name: 'Berinjela assada', carbohydrates: 8.6, proteins: 0.8, fats: 0.2, fiber: 2.5, sugar: 3.2, sodium: 2 },
    { name: 'Abacate', carbohydrates: 9, proteins: 2, fats: 15, fiber: 7, sugar: 0.7, sodium: 7 },
    { name: 'Maçã', carbohydrates: 14, proteins: 0.3, fats: 0.2, fiber: 2.4, sugar: 10, sodium: 1 },
    { name: 'Banana', carbohydrates: 23, proteins: 1.1, fats: 0.3, fiber: 2.6, sugar: 12, sodium: 1 },
    { name: 'Iogurte natural', carbohydrates: 3.6, proteins: 10, fats: 0.4, fiber: 0, sugar: 3.2, sodium: 36 },
    { name: 'Leite desnatado', carbohydrates: 5, proteins: 3.4, fats: 1, fiber: 0, sugar: 5, sodium: 44 },
    { name: 'Pão integral', carbohydrates: 12, proteins: 3.6, fats: 1.1, fiber: 1.9, sugar: 1.6, sodium: 132 },
    { name: 'Queijo branco', carbohydrates: 1.3, proteins: 6.1, fats: 7.9, fiber: 0, sugar: 0.5, sodium: 174 },
  ];

  const transaction = await sequelize.transaction();
  try {

    const foodsToCreate = foodData.map((data) => ({ name: data.name }));
    const createdFoods = await Food.bulkCreate(foodsToCreate, { transaction });

    const nutritionFactsToCreate = foodData.map((data, index) => {
      const calories = calculateCalories(data.carbohydrates, data.proteins, data.fats);
      return {
        foodId: createdFoods[index].id, 
        calories: calories, 
        carbohydrates: data.carbohydrates,
        proteins: data.proteins,
        fats: data.fats,
        fiber: data.fiber,
        sugar: data.sugar,
        sodium: data.sodium,
      };
    });

    await NutritionFacts.bulkCreate(nutritionFactsToCreate, { transaction });

    await transaction.commit();
    console.log('Foods criadas com sucesso no banco!');
  } catch (error) {
    await transaction.rollback();
    console.error('Erro ao criar foods no banco!:', error.message);
    throw error;
  }
};
