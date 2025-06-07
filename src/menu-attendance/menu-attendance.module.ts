import { Module } from '@nestjs/common'
import { MenuAttendanceService } from './menu-attendance.service'
import { MenuAttendanceController } from './menu-attendance.controller'
import { MenuModule } from 'src/menu/menu.module'
import { CustomerModule } from 'src/customer/customer.module'
import { MenuAttendanceRepository } from './menu-attendance.repository'
import { DatabaseModule } from 'src/database/database.module'

@Module({
	imports: [DatabaseModule, MenuModule, CustomerModule],
	controllers: [MenuAttendanceController],
	providers: [MenuAttendanceService, MenuAttendanceRepository],
})
export class MenuAttendanceModule {}
