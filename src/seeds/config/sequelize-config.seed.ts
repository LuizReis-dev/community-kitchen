
import { Sequelize } from 'sequelize-typescript';
import * as dotenv from 'dotenv';


import { Food } from '../../food/entities/food.entity';
import { NutritionFacts } from '../../food/entities/nutrition-facts.entity';
import { Dish } from '../../dish/entities/dish.entity';
import { DishFood } from '../../dish/entities/dish-food.entity';
import { DishMenu } from '../../menu/entities/dish-menu';
import { Menu } from '../../menu/entities/menu.entity';
import { MenuRequirement } from '../../menu-requirement/entities/menu-requirement.entity';
import { DailyEvent } from '../../daily-event/entities/daily-event.entity';
import { Customer } from '../../customer/entities/customer.entity';
import { MenuAttendance } from '../../menu-attendance/entities/menu-attendance.entity';

dotenv.config(); 

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost', 
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '1234',
  database: process.env.DB_NAME || 'postgres',
  models: [
    Food,
    NutritionFacts,
    Dish,
    DishFood,
    MenuRequirement,
    Menu,
    DishMenu,
    DailyEvent,
    Customer,
    MenuAttendance,
  ], 
  logging: false, 
});

export { sequelize }; 