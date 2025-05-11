import { Injectable } from '@nestjs/common';
import { CreateMenuRequirementDto } from './dto/create-menu-requirement.dto';
import { UpdateMenuRequirementDto } from './dto/update-menu-requirement.dto';
import { MenuRequirementRepository } from './menu-requirement.repository';

@Injectable()
export class MenuRequirementService {
  constructor(
    private readonly menuRequirementRepository: MenuRequirementRepository,
  ) {}

  async create(createMenuRequirementDto: CreateMenuRequirementDto) {
    return 'This action adds a new menuRequirement';
  }

  async findAll() {
    return `This action returns all menuRequirements`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} menuRequirement`;
  }

  async update(id: number, updateMenuRequirementDto: UpdateMenuRequirementDto) {
    return `This action updates a #${id} menuRequirement`;
  }

  async remove(id: number): Promise<void> {
    `This action removes a #${id} menuRequirement`;
  }
}
