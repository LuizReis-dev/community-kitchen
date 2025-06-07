// src/customer/seeds/create-customers.seed.ts
import { Sequelize } from 'sequelize-typescript';
import { Customer } from 'src/customer/entities/customer.entity';


export const createCustomers = async (sequelize: Sequelize) => {
  const customersData = [
    {
      taxId: '10312788770', 
      name: 'Ana Silva',
      birthDate: '1985-03-15',
    },
    {
      taxId: '57192795712', 
      name: 'Bruno Costa',
      birthDate: '1992-07-22',
    },
    {
      taxId: '20982841795',
      name: 'Carla Dias',
      birthDate: '1978-11-05',
    },
    {
      taxId: '01702167720',
      name: 'Daniel Lima',
      birthDate: '1995-01-30',
    },
    {
      taxId: '86101351793', 
      name: 'Eduarda Gomes',
      birthDate: '1980-09-10',
    },
    {
      taxId: '90048472786', 
      name: 'Felipe Santos',
      birthDate: '1990-04-25',
    },
    {
      taxId: '63049528729',
      name: 'Gabriela Alves',
      birthDate: '1983-02-18',
    },
    {
      taxId: '85157151713',
      name: 'Hugo Pereira',
      birthDate: '1998-12-01',
    },
    {
      taxId: '10339719796',
      name: 'Isabela Rocha',
      birthDate: '1975-06-07',
    },
    {
      taxId: '07449449706',
      name: 'João Mendes',
      birthDate: '1987-10-12',
    },
  ];

  const transaction = await sequelize.transaction();
  try {

    await Customer.bulkCreate(customersData, { transaction });

    await transaction.commit();
    console.log('Customers criados com sucesso no banco!');
  } catch (error) {
    await transaction.rollback();
    console.error('Erro ao criar customers no banco!:', error.message);
    throw error;
  }
};