import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  NotNull,
  PrimaryKey,
  Table,
  Model,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from 'sequelize-typescript'
import { Food } from './food.entity'

@Table({
  tableName: 'tb_nutrition_facts',
  modelName: 'NutritionFacts',
})
export class NutritionFacts extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number

  @ForeignKey(() => Food)
  @Column({ field: 'food_id' })
  declare foodId: number

  @Column({ type: DataType.DECIMAL, allowNull: false })
  declare calories: number

  @Column({ type: DataType.DECIMAL, allowNull: false })
  declare carbohydrates: number

  @Column({ type: DataType.DECIMAL, allowNull: false })
  declare proteins: number

  @Column({ type: DataType.DECIMAL, allowNull: false })
  declare fats: number

  @Column({ type: DataType.DECIMAL, allowNull: false })
  declare fiber: number

  @Column({ type: DataType.DECIMAL, allowNull: false })
  declare sugar: number

  @Column({ type: DataType.DECIMAL, allowNull: false })
  declare sodium: number

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
