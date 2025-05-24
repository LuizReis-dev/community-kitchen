import {
	AutoIncrement,
	BelongsTo,
	Column,
	CreatedAt,
	DataType,
	DeletedAt,
	ForeignKey,
	Model,
	PrimaryKey,
	Table,
	UpdatedAt,
} from 'sequelize-typescript'
import { MenuRequirement } from 'src/menu-requirement/entities/menu-requirement.entity'

@Table({
	tableName: 'tb_daily_events',
	modelName: 'DailyEvent',
})
export class DailyEvent extends Model {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	declare id: number

	@ForeignKey(() => MenuRequirement)
	@Column({ field: 'requirement_id', allowNull: false })
	declare requirement_id: number

	@BelongsTo(() => MenuRequirement)
	declare menu_requirement?: MenuRequirement

	@Column({ type: DataType.STRING, allowNull: false })
	declare name: string

	@Column({ type: DataType.TIME, allowNull: false })
	declare start_time: string

	@Column({ type: DataType.TIME, allowNull: false })
	declare end_time: string

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
