import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateCustomerDto } from './dto/create-customer.dto'
import { UpdateCustomerDto } from './dto/update-customer.dto'
import { CustomerRepository } from './customer.repository'
import { CustomerDto } from './dto/customer.dto';

@Injectable()
export class CustomerService {
	constructor(private readonly customerRepository: CustomerRepository) {}

	async create(createCustomerDto: CreateCustomerDto): Promise<CustomerDto> {
		
		let customerAlreadyExists = await this.customerRepository.findCustomerByTaxId(createCustomerDto.taxId) != null;

		if(customerAlreadyExists) {
			throw new BadRequestException("Já existe um cliente com este CPF");
		}
	
		return this.customerRepository.create(createCustomerDto);
	}

	findAll() {
		return `This action returns all customer`
	}

	findOne(id: number) {
		return `This action returns a #${id} customer`
	}

	update(id: number, updateCustomerDto: UpdateCustomerDto) {
		return `This action updates a #${id} customer`
	}

	remove(id: number) {
		return `This action removes a #${id} customer`
	}
}
