import {
	AutoIncrement,
	BelongsTo,
	Column,
	CreatedAt,
	DataType,
	DeletedAt,
	ForeignKey,
	HasMany,
	Model,
	PrimaryKey,
	Table,
	UpdatedAt,
} from 'sequelize-typescript'
import { MenuRequirement } from 'src/menu-requirement/entities/menu-requirement.entity'
import { Menu } from 'src/menu/entities/menu.entity'

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
	declare requirementId: number

	@BelongsTo(() => MenuRequirement)
	declare menuRequirement: MenuRequirement

	@Column({ type: DataType.STRING, allowNull: false })
	declare name: string

	@Column({ type: DataType.TIME, allowNull: false, field: 'start_time' })
	declare startTime: string

	@Column({ type: DataType.TIME, allowNull: false, field: 'end_time' })
	declare endTime: string

	@HasMany(() => Menu)
	declare menu: Menu[]

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
