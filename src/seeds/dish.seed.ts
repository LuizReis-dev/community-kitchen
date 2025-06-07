import { Sequelize } from 'sequelize-typescript';
import { Dish } from 'src/dish/entities/dish.entity';
import { DishFood } from 'src/dish/entities/dish-food.entity';
import { Food } from 'src/food/entities/food.entity';
import { CreateDishDto } from 'src/dish/dto/create-dish.dto';
import { DishFoodQuantityDto } from 'src/dish/dto/dish-food-quantity.dto';

export const createDishes = async (sequelize: Sequelize) => {

  const foods = await Food.findAll();

  const getFoodId = (name: string) => {
    const food = foods.find((f) => f.name === name);
    if (!food) throw new Error(`Food not found: ${name}`);
    return food.id;
  };

  const dishes = [
    {
      name: 'PF de Frango Tradicional',
      description: 'Arroz integral, feijão carioca, frango grelhado e salada de alface.',
      foods: [
        { food: 'Arroz integral', quantity: 150 },
        { food: 'Feijão carioca', quantity: 100 },
        { food: 'Frango grelhado', quantity: 120 },
        { food: 'Alface', quantity: 50 },
      ],
    },
    {
      name: 'Macarrão à Bolonhesa',
      description: 'Macarrão integral com molho de tomate e carne moída.',
      foods: [
        { food: 'Macarrão integral', quantity: 180 },
        { food: 'Molho de tomate', quantity: 80 },
        { food: 'Carne moída', quantity: 100 },
      ],
    },
    {
      name: 'Salada Vegana Proteica',
      description: 'Grão de bico, espinafre, tofu e abacate.',
      foods: [
        { food: 'Grão de bico', quantity: 120 },
        { food: 'Espinafre', quantity: 50 },
        { food: 'Tofu', quantity: 100 },
        { food: 'Abacate', quantity: 70 },
      ],
    },
    {
      name: 'Omelete com legumes',
      description: 'Ovo cozido, cenoura cozida, abobrinha e tomate.',
      foods: [
        { food: 'Ovo cozido', quantity: 60 },
        { food: 'Cenoura cozida', quantity: 80 },
        { food: 'Abobrinha', quantity: 70 },
        { food: 'Tomate', quantity: 60 },
      ],
    },
    {
      name: 'Quinoa com legumes',
      description: 'Quinoa, berinjela, repolho roxo e abobrinha.',
      foods: [
        { food: 'Quinoa cozida', quantity: 150 },
        { food: 'Berinjela assada', quantity: 80 },
        { food: 'Repolho roxo', quantity: 70 },
        { food: 'Abobrinha', quantity: 60 },
      ],
    },
    {
      name: 'Lentilha com arroz e salada',
      description: 'Lentilha, arroz integral, tomate e alface.',
      foods: [
        { food: 'Lentilha', quantity: 100 },
        { food: 'Arroz integral', quantity: 130 },
        { food: 'Tomate', quantity: 60 },
        { food: 'Alface', quantity: 50 },
      ],
    },
    {
      name: 'Sanduiche Leve',
      description: 'Pão integral e queijo branco.',
      foods: [
        { food: 'Pão integral', quantity: 60 },
        { food: 'Queijo branco', quantity: 50 },
      ],
    },
    {
      name: 'Sobremesa de banana da casa',
      description: 'Banana, iogurte natural e leite desnatado.',
      foods: [
        { food: 'Banana', quantity: 100 },
        { food: 'Iogurte natural', quantity: 120 },
        { food: 'Leite desnatado', quantity: 100 },
      ],
    },
    {
      name: 'Wrap vegetariano',
      description: 'Pão integral, tofu, tomate e espinafre.',
      foods: [
        { food: 'Pão integral', quantity: 80 },
        { food: 'Tofu', quantity: 90 },
        { food: 'Tomate', quantity: 60 },
        { food: 'Espinafre', quantity: 40 },
      ],
    },

  ];

  const transaction = await sequelize.transaction();
  try {

    for (const dish of dishes) {
      const dishDto = new CreateDishDto();
      dishDto.name = dish.name;
      dishDto.description = dish.description;
      dishDto.foods = dish.foods.map((item) => {
        const foodQuantity = new DishFoodQuantityDto();
        foodQuantity.foodId = getFoodId(item.food);
        foodQuantity.quantity = item.quantity;
        return foodQuantity;
      });
    }

    const createdDishes = await Dish.bulkCreate(
      dishes.map((dish) => ({
        name: dish.name,
        description: dish.description,
      })),
      { transaction }
    );

    const dishFoods = dishes.flatMap((dish, index) =>
      dish.foods.map((item) => ({
        dishId: createdDishes[index].id,
        foodId: getFoodId(item.food),
        quantity: item.quantity,
      }))
    );

    await DishFood.bulkCreate(dishFoods, { transaction });

    await transaction.commit();
    console.log('Dishes criadas com sucesso no banco!');
  } catch (error) {
    await transaction.rollback();
    console.error('Erro ao criar dishes no banco!', error.message);
    throw error;
  }
};
