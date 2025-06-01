import { HasMany, Model } from 'sequelize-typescript'
import {
	AutoIncrement,
	Column,
	CreatedAt,
	DataType,
	DeletedAt,
	PrimaryKey,
	Table,
	UpdatedAt,
} from 'sequelize-typescript'
import { MenuAttendance } from 'src/menu-attendance/entities/menu-attendance.entity'

@Table({
	tableName: 'tb_customer',
	modelName: 'Customer',
	timestamps: true,
})
export class Customer extends Model {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	declare id: number

	@Column({
		type: DataType.STRING(11),
		allowNull: false,
		unique: true,
		field: 'tax_id',
	})
	declare taxId: string

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	declare name: string

	@Column({
		type: DataType.DATEONLY,
		allowNull: false,
		field: 'birth_date',
	})
	declare birthDate: Date

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
