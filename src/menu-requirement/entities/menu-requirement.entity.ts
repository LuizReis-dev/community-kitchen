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
	@Column({ type: DataType.DECIMAL, allowNull: false })
	declare min_calories: number

	@NotNull
	@Column({ type: DataType.DECIMAL, allowNull: false })
	declare max_calories: number

	@NotNull
	@Column({ type: DataType.DECIMAL, allowNull: false })
	declare min_carbohydrates: number

	@NotNull
	@Column({ type: DataType.DECIMAL, allowNull: false })
	declare max_carbohydrates: number

	@NotNull
	@Column({ type: DataType.DECIMAL, allowNull: false })
	declare min_proteins: number

	@NotNull
	@Column({ type: DataType.DECIMAL, allowNull: false })
	declare max_proteins: number

	@NotNull
	@Column({ type: DataType.DECIMAL, allowNull: false })
	declare min_fats: number

	@NotNull
	@Column({ type: DataType.DECIMAL, allowNull: false })
	declare max_fats: number

	@NotNull
	@Column({ type: DataType.DECIMAL, allowNull: false })
	declare min_fiber: number

	@NotNull
	@Column({ type: DataType.DECIMAL, allowNull: false })
	declare max_fiber: number

	@NotNull
	@Column({ type: DataType.DECIMAL, allowNull: false })
	declare min_sugar: number

	@NotNull
	@Column({ type: DataType.DECIMAL, allowNull: false })
	declare max_sugar: number

	@NotNull
	@Column({ type: DataType.DECIMAL, allowNull: false })
	declare min_sodium: number

	@NotNull
	@Column({ type: DataType.DECIMAL, allowNull: false })
	declare max_sodium: number

	@NotNull
	@Column({
		type: DataType.BOOLEAN,
		allowNull: false,
		defaultValue: true,
	})
	declare is_active: boolean

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

	@HasMany(() => DailyEvent)
	declare daily_event: DailyEvent[]
}
