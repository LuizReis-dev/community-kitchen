import { Sequelize } from 'sequelize-typescript'
import { DishFood } from 'src/dish/entities/dish-food.entity'
import { Dish } from 'src/dish/entities/dish.entity'
import { Food } from 'src/food/entities/food.entity'
import { NutritionFacts } from 'src/food/entities/nutrition-facts.entity'
import { DishMenu } from 'src/menu/entities/dish-menu'
import { Menu } from 'src/menu/entities/menu.entity'
import { MenuRequirement } from 'src/menu-requirement/entities/menu-requirement.entity'
import { DailyEvent } from 'src/daily-event/entities/daily-event.entity'
import { Customer } from 'src/customer/entities/customer.entity'
const dotenv = require('dotenv')

dotenv.config()

export const databaseProviders = [
	{
		provide: 'SEQUELIZE',
		useFactory: async () => {
			const sequelize = new Sequelize({
				dialect: 'postgres',
				host: 'localhost',
				port: Number(process.env.DB_PORT) || 5432,
				username: process.env.DB_USER || 'postgres',
				password: process.env.DB_PASSWORD || '1234',
				database: process.env.DB_NAME || 'postgres',
			})
			sequelize.addModels([
				Food,
				NutritionFacts,
				Dish,
				DishFood,
				MenuRequirement,
				Menu,
				DishMenu,
				DailyEvent,
				Customer
			])
			await sequelize.sync()
			return sequelize
		},
	},
]
