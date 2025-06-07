import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Put,
	HttpCode,
	HttpStatus,
	Query,
} from '@nestjs/common'
import { CustomerService } from './customer.service'
import { CreateCustomerDto } from './dto/create-customer.dto'
import { UpdateCustomerDto } from './dto/update-customer.dto'
import { ApiOkResponse } from '@nestjs/swagger'
import { CustomerDto } from './dto/customer.dto'
import { MostFrequentCustomerDto } from './dto/most-frequent-customers.dto'

@Controller('customers')
export class CustomerController {
	constructor(private readonly customerService: CustomerService) {}

	@Post()
	@ApiOkResponse({ type: CustomerDto })
	@HttpCode(HttpStatus.CREATED)
	async create(@Body() createCustomerDto: CreateCustomerDto) {
		return this.customerService.create(createCustomerDto)
	}

	@Get()
	@ApiOkResponse({ type: [CustomerDto] })
	async findAll() {
		return this.customerService.findAll()
	}

	@Get(':id')
	@ApiOkResponse({ type: CustomerDto })
	async findOne(@Param('id') id: string) {
		return this.customerService.findOne(+id)
	}

	@Get('/taxid/:taxId')
	@ApiOkResponse({ type: CustomerDto })
	async findByTaxId(@Param('taxId') taxId: string) {
		return this.customerService.findByTaxId(taxId)
	}

	@Put(':id')
	@ApiOkResponse({ type: CustomerDto })
	async update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
		return this.customerService.update(+id, updateCustomerDto)
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	async remove(@Param('id') id: string) {
		return this.customerService.remove(+id)
	}

	@Get('filter/mostFrequent')
	@ApiOkResponse({ type: MostFrequentCustomerDto })
	async getTopCustomers(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
		return this.customerService.getMostFrequentCustomers(page, limit)
	}

	@Get('average/age')
	@ApiOkResponse()
	async getAverageAge() {
		return await this.customerService.getAverageCustomersAge()
	}
}
