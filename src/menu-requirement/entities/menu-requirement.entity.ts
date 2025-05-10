import {
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  Model,
  NotNull,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({
  tableName: 'tb_menu-requirements',
  modelName: 'MenuRequirement',
  timestamps: true,
})
export class MenuRequirement extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @NotNull
  @Column({ type: DataType.DECIMAL, allowNull: false })
  declare calories: number;

  @NotNull
  @Column({ type: DataType.DECIMAL, allowNull: false })
  declare carbohydrates: number;

  @NotNull
  @Column({ type: DataType.DECIMAL, allowNull: false })
  declare proteins: number;

  @NotNull
  @Column({ type: DataType.DECIMAL, allowNull: false })
  declare fats: number;

  @NotNull
  @Column({ type: DataType.DECIMAL, allowNull: false })
  declare fiber: number;

  @NotNull
  @Column({ type: DataType.DECIMAL, allowNull: false })
  declare sugar: number;

  @NotNull
  @Column({ type: DataType.DECIMAL, allowNull: false })
  declare sodium: number;

  @CreatedAt
  @Column({
    field: 'created_at',
  })
  declare createdAt: Date;

  @DeletedAt
  @Column({
    field: 'deleted_at',
  })
  declare deletedAt: Date;

  @UpdatedAt
  @Column({
    field: 'updated_at',
  })
  declare updateAt: Date;
}
