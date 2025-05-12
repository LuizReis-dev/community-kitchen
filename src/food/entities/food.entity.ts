import {
	AutoIncrement,
	Column,
	CreatedAt,
	DataType,
	DeletedAt,
	HasOne,
	PrimaryKey,
	Table,
	Model,
	BelongsToMany,
	UpdatedAt,
} from 'sequelize-typescript'
import { NutritionFacts } from './nutrition-facts.entity'
import { Dish } from 'src/dish/entities/dish.entity'
import { DishFood } from 'src/dish/entities/dish-food.entity'

@Table({
	tableName: 'tb_foods',
	modelName: 'Food',
	timestamps: true,
})
export class Food extends Model {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	declare id: number

	@HasOne(() => NutritionFacts)
	declare nutritionFacts: NutritionFacts

	@Column({ type: DataType.STRING, allowNull: false })
	declare name: string

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

	@BelongsToMany(() => Dish, () => DishFood)
	declare dishes?: Dish[]
}
