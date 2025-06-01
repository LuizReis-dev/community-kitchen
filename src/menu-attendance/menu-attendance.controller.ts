import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { MenuAttendanceService } from './menu-attendance.service';
import { CreateMenuAttendanceDto } from './dto/create-menu-attendance.dto';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { MenuAttendanceDto } from './dto/menu-attendance.dto';

@Controller('menu-attendance')
export class MenuAttendanceController {
  constructor(private readonly menuAttendanceService: MenuAttendanceService) {}

  @Post()
  @ApiCreatedResponse({ type: MenuAttendanceDto })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createMenuAttendanceDto: CreateMenuAttendanceDto) {
    return this.menuAttendanceService.create(createMenuAttendanceDto);
  }

  @Get()
  @ApiCreatedResponse({ type: [MenuAttendanceDto] })
  async findAll() {
    return this.menuAttendanceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuAttendanceService.findOne(+id);
  }
}
