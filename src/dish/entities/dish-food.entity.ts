import { Table, Model, Column, ForeignKey, DataType, BelongsTo } from 'sequelize-typescript'

import { Dish } from './dish.entity'
import { Food } from 'src/food/entities/food.entity'
@Table({
	tableName: 'tb_dishes_foods',
	timestamps: false,
})
export class DishFood extends Model {
	@ForeignKey(() => Dish)
	@Column({
		type: DataType.INTEGER,
		onDelete: 'CASCADE',
		field: 'dish_id',
	})
	declare dishId: number

	@ForeignKey(() => Food)
	@Column({
		type: DataType.INTEGER,
		onDelete: 'CASCADE',
		field: 'food_id',
	})
	declare foodId: number

	@BelongsTo(() => Dish)
	dish: Dish

	@BelongsTo(() => Food)
	food: Food
}
