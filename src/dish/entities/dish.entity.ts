import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  DeletedAt,
  BelongsToMany,
  UpdatedAt,
} from 'sequelize-typescript'

import { DishFood } from './dish-food.entity'
import { Food } from 'src/food/entities/food.entity'
import { DishMenu } from 'src/menu/entities/dish-menu'
import { Menu } from 'src/menu/entities/menu.entity'

@Table({
  tableName: 'tb_dishes',
  modelName: 'Dish',
  timestamps: true,
})
export class Dish extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number

  @Column(DataType.STRING)
  declare name: string

  @Column(DataType.STRING)
  declare description: string

  @CreatedAt
  @Column({
    field: 'created_at',
  })
  declare createdAt: Date

  @DeletedAt
  @Column({
    field: 'deleted_at',
  })
  declare deletedAt: Date

  @UpdatedAt
  @Column({
    field: 'updated_at',
  })
  declare updatedAt: Date

  @BelongsToMany(() => Food, () => DishFood)
  declare foods?: Food[]

  @BelongsToMany(() => Menu, () => DishMenu)
  declare menus?: Menu[]
}
