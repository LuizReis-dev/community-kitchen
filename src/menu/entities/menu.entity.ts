import {
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  PrimaryKey,
  Table,
  Model,
  UpdatedAt,
  BelongsToMany,
} from 'sequelize-typescript'
import { Dish } from 'src/dish/entities/dish.entity'
import { DishMenu } from './dish-menu'

@Table({
  tableName: 'tb_menu',
  modelName: 'Menu',
  timestamps: true,
})
export class Menu extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number

  @Column({ type: DataType.DATE, allowNull: false })
  declare availabilityDate: Date

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare availabilityHour: number

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare createdBy: number

  @BelongsToMany(() => Dish, () => DishMenu)
  declare dishes: Dish[]

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
  declare updateAt: Date
}
