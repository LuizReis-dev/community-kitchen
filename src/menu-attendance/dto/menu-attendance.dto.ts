import { ApiProperty } from "@nestjs/swagger";
import { MenuAttendance } from "../entities/menu-attendance.entity";

export class MenuAttendanceDto {
    @ApiProperty()
    id: number;
    @ApiProperty()
    menuId: number;
    @ApiProperty({ example: "Luiz Reis"})
    customerName: string;
    @ApiProperty({ example: "Sunday"})
    weekDay: string;
    @ApiProperty({ example: "2025-06-01T19:01:36.939Z"})
    attendDate: Date;

    constructor(
        id: number,
        menuId: number,
        customerName: string,
        weekDay: string,
        attendDate: Date
    ) {
        this.id = id;
        this.menuId = menuId;
        this.customerName = customerName;
        this.weekDay = weekDay;
        this.attendDate = attendDate;
    }
    static fromEntity(entity: MenuAttendance): MenuAttendanceDto {
        return new MenuAttendanceDto(entity.id, entity.menu.id, entity.customer.name, entity.menu.availableDay, entity.createdAt);
    }
}
