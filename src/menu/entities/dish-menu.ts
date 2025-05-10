import {
  AutoIncrement,
  Column,
  DataType,
  PrimaryKey,
  Table,
  Model,
  ForeignKey,
} from 'sequelize-typescript'
import { Dish } from 'src/dish/entities/dish.entity'
import { Menu } from './menu.entity'

@Table({
  tableName: 'tb_dishes_menus',
  modelName: 'DishMenu',
  timestamps: true,
})
export class DishMenu extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number

  @ForeignKey(() => Dish)
  @Column({
    type: DataType.INTEGER,
    onDelete: 'CASCADE',
    field: 'dish_id',
  })
  declare dishId: number

  @ForeignKey(() => Menu)
  @Column({
    type: DataType.INTEGER,
    onDelete: 'CASCADE',
    field: 'menu_id',
  })
  declare menuId: number
}
