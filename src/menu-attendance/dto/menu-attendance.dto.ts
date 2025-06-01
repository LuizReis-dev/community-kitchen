import { MenuAttendance } from "../entities/menu-attendance.entity";

export class MenuAttendanceDto {
    id: number
    menuId: number
    customerId: number

    constructor(
        id: number,
        menuId: number,
        customerId: number
    ) {
        this.id = id;
        this.menuId = menuId;
        this.customerId = customerId;
    }
    static fromEntity(entity: MenuAttendance): MenuAttendanceDto {

        return new MenuAttendanceDto(entity.id, entity.menuId, entity.customerId);

    }
}
