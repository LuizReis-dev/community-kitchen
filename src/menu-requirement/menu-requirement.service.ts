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
    return `This action updates a #${id} menuRequirement`;
  }

  async remove(id: number): Promise<void> {
    `This action removes a #${id} menuRequirement`;
  }
}
