import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { MenuAttendanceService } from './menu-attendance.service';
import { CreateMenuAttendanceDto } from './dto/create-menu-attendance.dto';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
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
  @ApiOkResponse({ type: [MenuAttendanceDto] })
  async findAll() {
    return this.menuAttendanceService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: MenuAttendanceDto })
  findOne(@Param('id') id: string) {
    return this.menuAttendanceService.findOne(+id);
  }

  @Get('/customer/:customerId')
  @ApiOkResponse({ type: [MenuAttendanceDto] })
  findAllByCustomer(@Param('customerId') customerId: string) {
    return this.menuAttendanceService.findAllByCustomer(+customerId);
  }
}
