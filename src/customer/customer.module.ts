import { Module } from '@nestjs/common'
import { CustomerService } from './customer.service'
import { CustomerController } from './customer.controller'
import { CustomerRepository } from './customer.repository'
import { DatabaseModule } from 'src/database/database.module'
import { MenuAttendance } from 'src/menu-attendance/entities/menu-attendance.entity'

@Module({
	imports: [DatabaseModule, MenuAttendance],
	controllers: [CustomerController],
	providers: [CustomerService, CustomerRepository],
	exports: [CustomerService],
})
export class CustomerModule {}
