import { Module } from '@nestjs/common'
import { CustomerService } from './customer.service'
import { CustomerController } from './customer.controller'
import { CustomerRepository } from './customer.repository'
import { DatabaseModule } from 'src/database/database.module'

@Module({
	imports: [DatabaseModule],
	controllers: [CustomerController],
	providers: [CustomerService, CustomerRepository],
})
export class CustomerModule {}
