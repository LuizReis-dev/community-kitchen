import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateCustomerDto } from './dto/create-customer.dto'
import { UpdateCustomerDto } from './dto/update-customer.dto'
import { CustomerRepository } from './customer.repository'
import { CustomerDto } from './dto/customer.dto'
import { NotFoundError } from 'rxjs'
import { MostFrequentCustomerDto } from './dto/most-frequent-customers.dto'

@Injectable()
export class CustomerService {
	constructor(private readonly customerRepository: CustomerRepository) {}

	async create(createCustomerDto: CreateCustomerDto): Promise<CustomerDto> {
		let customerAlreadyExists =
			(await this.customerRepository.findCustomerByTaxId(createCustomerDto.taxId)) != null

		if (customerAlreadyExists) {
			throw new BadRequestException('Já existe um cliente com este CPF')
		}

		return this.customerRepository.create(createCustomerDto)
	}

	async findAll(): Promise<CustomerDto[]> {
		return this.customerRepository.findAll()
	}

	async findOne(id: number): Promise<CustomerDto> {
		const customer = await this.customerRepository.findOne(id)

		if (!customer) {
			throw new NotFoundException('Cliente não encontrado!')
		}

		return customer
	}

	async findByTaxId(taxId: string): Promise<CustomerDto | null> {
		const customer = await this.customerRepository.findCustomerByTaxId(taxId)

		if (!customer) {
			throw new NotFoundException('Cliente não encontrado!')
		}

		return customer
	}

	async update(id: number, updateCustomerDto: UpdateCustomerDto) {
		let customer = await this.customerRepository.findOne(id)

		if (customer == null) {
			throw new NotFoundException('Cliente não encontrado!')
		}

		let customerAlreadyExists =
			customer.taxId != updateCustomerDto.taxId &&
			(await this.customerRepository.findCustomerByTaxId(updateCustomerDto.taxId)) != null

		if (customerAlreadyExists) {
			throw new BadRequestException('Já existe um cliente com este CPF')
		}

		return this.customerRepository.update(id, updateCustomerDto)
	}

	async remove(id: number) {
		return this.customerRepository.remove(id)
	}

	async getMostFrequentCustomers(
		limit: number,
		offset: number
	): Promise<MostFrequentCustomerDto[]> {
		return this.customerRepository.getMostFrequentCustomers(limit, offset)
	}

	async getAverageCustomersAge(): Promise<{ averageAge: number }> {
		const customers = await this.customerRepository.findAll()
		const total = customers.length

		if (total === 0) {
			return { averageAge: 0 }
		}

		const ages = customers.map(customer => this.calculateAge(new Date(customer.birthDate)))
		const totalAge = ages.reduce((sum, age) => sum + age, 0)
		const averageAge = Number((totalAge / total).toFixed(2))

		return { averageAge }
	}

	private calculateAge(birthDate: Date): number {
		const today = new Date()
		let age = today.getFullYear() - birthDate.getFullYear()
		const monthDiff = today.getMonth() - birthDate.getMonth()

		if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
			age--
		}

		return age
	}
}
