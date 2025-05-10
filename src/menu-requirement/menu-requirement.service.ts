import { Injectable } from '@nestjs/common';
import { CreateMenuRequirementDto } from './dto/create-menu-requirement.dto';
import { UpdateMenuRequirementDto } from './dto/update-menu-requirement.dto';

@Injectable()
export class MenuRequirementService {
  create(createMenuRequirementDto: CreateMenuRequirementDto) {
    return 'This action adds a new menuRequirement';
  }

  findAll() {
    return `This action returns all menuRequirement`;
  }

  findOne(id: number) {
    return `This action returns a #${id} menuRequirement`;
  }

  update(id: number, updateMenuRequirementDto: UpdateMenuRequirementDto) {
    return `This action updates a #${id} menuRequirement`;
  }

  remove(id: number) {
    return `This action removes a #${id} menuRequirement`;
  }
}
