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
	ForeignKey,
	BelongsTo,
	HasMany,
} from 'sequelize-typescript'
import { Dish } from 'src/dish/entities/dish.entity'
import { DishMenu } from './dish-menu'
import { DailyEvent } from 'src/daily-event/entities/daily-event.entity'
import { MenuAttendance } from 'src/menu-attendance/entities/menu-attendance.entity'

@Table({
	tableName: 'tb_menus',
	modelName: 'Menu',
	timestamps: true,
})
export class Menu extends Model {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	declare id: number

	@Column({ type: DataType.DATE, allowNull: true, defaultValue: new Date() })
	declare activationDate: Date

	@Column({ type: DataType.DATE, allowNull: true, defaultValue: null })
	declare deactivationDate: Date

	@Column({ type: DataType.STRING, allowNull: false })
	declare availableDay: string

	@Column({ type: DataType.STRING, allowNull: false })
	declare createdBy: string

	@BelongsToMany(() => Dish, () => DishMenu)
	declare dishes: Dish[]

	@ForeignKey(() => DailyEvent)
	@Column({ field: 'daily_event_id' })
	declare dailyEventId: number

	@BelongsTo(() => DailyEvent)
	declare dailyEvent: DailyEvent

	@HasMany(() => MenuAttendance)
  	declare menuAttendances: MenuAttendance[];

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
