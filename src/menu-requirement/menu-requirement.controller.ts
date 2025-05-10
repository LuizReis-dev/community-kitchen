import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MenuRequirementService } from './menu-requirement.service';
import { CreateMenuRequirementDto } from './dto/create-menu-requirement.dto';
import { UpdateMenuRequirementDto } from './dto/update-menu-requirement.dto';

@Controller('menu-requirement')
export class MenuRequirementController {
  constructor(private readonly menuRequirementService: MenuRequirementService) {}

  @Post()
  create(@Body() createMenuRequirementDto: CreateMenuRequirementDto) {
    return this.menuRequirementService.create(createMenuRequirementDto);
  }

  @Get()
  findAll() {
    return this.menuRequirementService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuRequirementService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMenuRequirementDto: UpdateMenuRequirementDto) {
    return this.menuRequirementService.update(+id, updateMenuRequirementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuRequirementService.remove(+id);
  }
}
