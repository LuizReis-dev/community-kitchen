import { AutoIncrement, BelongsTo, Column, CreatedAt, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Customer } from "src/customer/entities/customer.entity";
import { Menu } from "src/menu/entities/menu.entity";

@Table({
    tableName: 'tb_menu_attendances',
    modelName: 'MenuAttendance',
    timestamps: true,
})
export class MenuAttendance extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number
    
    @ForeignKey(() => Menu)
    @Column({
        type: DataType.INTEGER,
        field: 'menu_id',
    })
    declare menuId: number;

    @BelongsTo(() => Menu)
    declare menu: Menu;

    @ForeignKey(() => Customer)
    @Column({
        type: DataType.INTEGER,
        field: 'customer_id',
    })
    declare customerId: number;

    @BelongsTo(() => Customer)
    declare customer: Customer;

    @CreatedAt
    @Column({
        field: 'created_at',
    })
    declare createdAt: Date
}
