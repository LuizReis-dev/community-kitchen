import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMenuRequirementDto } from './dto/create-menu-requirement.dto';
import { Sequelize } from 'sequelize-typescript';
import { MenuRequirementDto } from './dto/menu-requirement.dto';
import { MenuRequirement } from './entities/menu-requirement.entity';
import { UpdateMenuRequirementDto } from './dto/update-menu-requirement.dto';
import { Transaction } from 'sequelize';

@Injectable()
export class MenuRequirementRepository {
  constructor(@Inject('SEQUELIZE') private sequelize: Sequelize) {}

  async create(
    createMenuRequirementDto: CreateMenuRequirementDto,
  ): Promise<MenuRequirementDto> {
    const transaction = await this.sequelize.transaction();
    try {
      this.deactivateMenuRequirement(transaction);

      const menuRequirement = await MenuRequirement.create(
        { ...createMenuRequirementDto }, // Converte o DTO para um objeto literal
        { transaction },
      );

      await transaction.commit();
      return MenuRequirementDto.fromEntity(menuRequirement);
    } catch (error) {
      await transaction.rollback();
      throw new BadRequestException('Erro ao cadastrar especificações do menu');
    }
  }

  async deactivateMenuRequirement(transaction: Transaction): Promise<void> {
    await MenuRequirement.update(
      { isActive: false },
      {
        where: {
          isActive: true,
          deletedAt: null,
        },
        transaction,
      },
    );
  }

  async findOne(id: number): Promise<MenuRequirementDto> {
    const menuRequirement = await MenuRequirement.findByPk(id);

    if (!menuRequirement)
      throw new NotFoundException(
        'Especificações do menu não foram encontradas!',
      );

    return MenuRequirementDto.fromEntity(menuRequirement);
  }
}
