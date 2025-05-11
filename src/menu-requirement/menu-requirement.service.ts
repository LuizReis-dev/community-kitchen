import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMenuRequirementDto } from './dto/create-menu-requirement.dto';
import { UpdateMenuRequirementDto } from './dto/update-menu-requirement.dto';
import { MenuRequirementRepository } from './menu-requirement.repository';
import { validateSync } from 'class-validator';

@Injectable()
export class MenuRequirementService {
  constructor(
    private readonly menuRequirementRepository: MenuRequirementRepository,
  ) {}

  async create(createMenuRequirementDto: CreateMenuRequirementDto) {
    return this.menuRequirementRepository.create(createMenuRequirementDto);
  }

  async findAll() {
    return this.menuRequirementRepository.findAll();
  }

  async findOne(id: number) {
    return this.menuRequirementRepository.findOne(id);
  }

  async update(id: number, updateMenuRequirementDto: UpdateMenuRequirementDto) {
    const dto = Object.assign(
      new UpdateMenuRequirementDto(),
      updateMenuRequirementDto,
    );
    const errors = validateSync(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      throw new BadRequestException({
        msg: 'Não foi possivel atualizar, dados inválidos!',
        errors,
      });
    }

    return this.menuRequirementRepository.update(id, updateMenuRequirementDto);
  }

  async remove(id: number): Promise<void> {
    if ((await this.menuRequirementRepository.findOne(id)).isActive == true) {
      throw new BadRequestException(
        'Não é possivel remover essa especificação, pois ela está em uso!',
      );
    }
    return this.menuRequirementRepository.remove(id);
  }
}
