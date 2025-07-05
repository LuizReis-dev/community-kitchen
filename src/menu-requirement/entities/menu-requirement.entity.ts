import {
	AutoIncrement,
	Column,
	CreatedAt,
	DataType,
	DeletedAt,
	HasMany,
	Model,
	NotNull,
	PrimaryKey,
	Table,
	UpdatedAt,
} from 'sequelize-typescript'
import { DailyEvent } from 'src/daily-event/entities/daily-event.entity'

@Table({
	tableName: 'tb_menu_requirements',
	modelName: 'MenuRequirement',
	timestamps: true,
})
export class MenuRequirement extends Model {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	declare id: number

	@NotNull
	@Column({ type: DataType.DECIMAL, allowNull: false, field: 'min_calories' })
	declare minCalories: number

	@NotNull
	@Column({ type: DataType.DECIMAL, allowNull: false, field: 'max_calories' })
	declare maxCalories: number

	@NotNull
	@Column({ type: DataType.DECIMAL, allowNull: false, field: 'min_carbohydrates' })
	declare minCarbohydrates: number

	@NotNull
	@Column({ type: DataType.DECIMAL, allowNull: false, field: 'max_carbohydrates' })
	declare maxCarbohydrates: number

	@NotNull
	@Column({ type: DataType.DECIMAL, allowNull: false, field: 'min_proteins' })
	declare minProteins: number

	@NotNull
	@Column({ type: DataType.DECIMAL, allowNull: false, field: 'max_proteins' })
	declare maxProteins: number

	@NotNull
	@Column({ type: DataType.DECIMAL, allowNull: false, field: 'min_fats' })
	declare minFats: number

	@NotNull
	@Column({ type: DataType.DECIMAL, allowNull: false, field: 'max_fats' })
	declare maxFats: number

	@NotNull
	@Column({ type: DataType.DECIMAL, allowNull: false, field: 'min_fiber' })
	declare minFiber: number

	@NotNull
	@Column({ type: DataType.DECIMAL, allowNull: false, field: 'max_fiber' })
	declare maxFiber: number

	@NotNull
	@Column({ type: DataType.DECIMAL, allowNull: false, field: 'min_sugar' })
	declare minSugar: number

	@NotNull
	@Column({ type: DataType.DECIMAL, allowNull: false, field: 'max_sugar' })
	declare maxSugar: number

	@NotNull
	@Column({ type: DataType.DECIMAL, allowNull: false, field: 'min_sodium' })
	declare minSodium: number

	@NotNull
	@Column({ type: DataType.DECIMAL, allowNull: false, field: 'max_sodium' })
	declare maxSodium: number

	@NotNull
	@Column({
		type: DataType.BOOLEAN,
		allowNull: false,
		defaultValue: true,
		field: 'is_active',
	})
	declare isActive: boolean

	@CreatedAt
	@Column({
		field: 'created_at',
	})
	declare createdAt: Date

	@DeletedAt
	@Column({
		type: DataType.DATE,
		field: 'deleted_at',
		allowNull: true
	})
	declare deletedAt: Date | null

	@UpdatedAt
	@Column({
		field: 'updated_at',
	})
	declare updatedAt: Date

	@HasMany(() => DailyEvent)
	declare dailyEvent: DailyEvent[]
}
