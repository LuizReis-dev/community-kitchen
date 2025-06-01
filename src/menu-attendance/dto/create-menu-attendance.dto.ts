import { ApiProperty } from "@nestjs/swagger";
import { IsRequiredTypeOf } from "src/common/decorators/validation";

export class CreateMenuAttendanceDto {

    @IsRequiredTypeOf('number')
    @ApiProperty()
    menuId: number

    @IsRequiredTypeOf('number')
    @ApiProperty()
    customerId: number
}
