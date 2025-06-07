import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { Sequelize } from 'sequelize-typescript'
import { CreateCustomerDto } from './dto/create-customer.dto'
import { CustomerDto } from './dto/customer.dto'
import { Customer } from './entities/customer.entity'
import { UpdateCustomerDto } from './dto/update-customer.dto'
import { col, fn, literal } from 'sequelize'
import { MostFrequentCustomerDto } from './dto/most-frequent-customers.dto'
import { MenuAttendance } from 'src/menu-attendance/entities/menu-attendance.entity'

@Injectable()
export class CustomerRepository {
	constructor(@Inject('SEQUELIZE') private sequelize: Sequelize) {}

	async create(createCustomerDto: CreateCustomerDto): Promise<CustomerDto> {
		const transaction = await this.sequelize.transaction()
		try {
			const customer = await Customer.create(
				{
					taxId: createCustomerDto.taxId,
					name: createCustomerDto.name,
					birthDate: createCustomerDto.birthDate,
				},
				{ transaction }
			)

			await transaction.commit()
			return CustomerDto.fromEntity(customer)
		} catch {
			await transaction.rollback()
			throw new BadRequestException('Erro ao inserir o cliente!')
		}
	}

	async findAll(): Promise<CustomerDto[]> {
		const customers = await Customer.findAll()

		return customers.map(customer => CustomerDto.fromEntity(customer))
	}

	async findOne(id: number): Promise<CustomerDto | null> {
		const customer = await Customer.findByPk(id)

		if (!customer) return null

		return CustomerDto.fromEntity(customer)
	}

	async findCustomerByTaxId(taxId: string): Promise<CustomerDto | null> {
		let customer = await Customer.findOne({
			where: {
				taxId: taxId,
			},
		})

		if (!customer) return null

		return CustomerDto.fromEntity(customer)
	}

	async update(id: number, updateCustomerDto: UpdateCustomerDto): Promise<CustomerDto> {
		const customer = await Customer.findByPk(id)
		const transaction = await this.sequelize.transaction()
		try {
			if (customer == null) throw new BadRequestException('Customer not found')
			await customer.update(
				{
					name: updateCustomerDto.name,
					taxId: updateCustomerDto.taxId,
					birthDate: updateCustomerDto.birthDate,
				},
				{ transaction }
			)

			await transaction.commit()
			return CustomerDto.fromEntity(customer)
		} catch {
			await transaction.rollback()
			throw new BadRequestException('Erro ao atualizar o alimento!')
		}
	}

	async remove(id: number) {
		await Customer.destroy({
			where: {
				id: id,
			},
		})
	}

	async getMostFrequentCustomers(page = 1, limit = 10): Promise<MostFrequentCustomerDto[]> {
		const result = await Customer.findAll({
			attributes: {
				include: [[fn('COUNT', col('menuAttendances.id')), 'attendanceCount']],
			},
			include: [
				{
					model: MenuAttendance,
					attributes: [],
				},
			],
			group: ['Customer.id'],
			order: [[Sequelize.col('attendanceCount'), 'DESC']],
			limit,
			offset: (page - 1) * limit,
			subQuery: false,
		})

		return result.map(customer => MostFrequentCustomerDto.fromEntity(customer))
	}
}
