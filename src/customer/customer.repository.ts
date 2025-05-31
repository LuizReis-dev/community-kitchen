import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { Sequelize } from 'sequelize-typescript'
import { CreateCustomerDto } from './dto/create-customer.dto'
import { CustomerDto } from './dto/customer.dto'
import { Customer } from './entities/customer.entity'

@Injectable()
export class CustomerRepository {
    constructor(@Inject('SEQUELIZE') private sequelize: Sequelize) { }

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
            return CustomerDto.fromEntity(customer);
        } catch {
            await transaction.rollback()
            throw new BadRequestException('Erro ao inserir o cliente!')
        }
    }

    async findAll(): Promise<CustomerDto[]> {
        const customers = await Customer.findAll();

        return customers.map(customer => CustomerDto.fromEntity(customer));
    }

    async findOne(id: number): Promise<CustomerDto|null> {
        const customer = await Customer.findByPk(id);
        
        if(!customer) return null;

        return CustomerDto.fromEntity(customer);
    }

    async findCustomerByTaxId(taxId: string): Promise<CustomerDto | null> {
        let customer = await Customer.findOne({
            where: {
                taxId: taxId
            }
        });

        if(!customer) return null;

        return CustomerDto.fromEntity(customer);
    }
}
