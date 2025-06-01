import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMenuAttendanceDto } from './dto/create-menu-attendance.dto';
import { WEEK_DAYS } from 'src/common/enums/week-days';
import { MenuService } from 'src/menu/menu.service';
import { CustomerService } from 'src/customer/customer.service';
import { MenuAttendanceRepository } from './menu-attendance.repository';
import { MenuAttendanceDto } from './dto/menu-attendance.dto';

@Injectable()
export class MenuAttendanceService {
  constructor(
    private readonly menuService: MenuService,
    private readonly customerService: CustomerService,
    private readonly menuAttendanceRepository: MenuAttendanceRepository
  ) { }

  async create(createMenuAttendanceDto: CreateMenuAttendanceDto): Promise<MenuAttendanceDto> {
    const todayWeekDay = this.getTodayWeekDay();

    const menu = await this.menuService.findOne(createMenuAttendanceDto.menuId);
    const customer = await this.customerService.findOne(createMenuAttendanceDto.customerId);
    const isMenuAvailable = menu.availableDay == todayWeekDay && menu.deactivationDate == null;

    if (!isMenuAvailable) {
      throw new BadRequestException("Menu não está disponível hoje");
    }

    const customerAlreadyServed = await this.menuAttendanceRepository.findByCustomerIdAndDate(
      customer.id,
      new Date(),
    );

    if (customerAlreadyServed) {
      throw new BadRequestException('Este cliente já possui atendimento registrado hoje.');
    }

    return this.menuAttendanceRepository.create(createMenuAttendanceDto);
  }

  async findAll(): Promise<MenuAttendanceDto[]> {
    return this.menuAttendanceRepository.findAll();
  }

  async findOne(id: number): Promise<MenuAttendanceDto> {
    const menuAttendanceDto = await this.menuAttendanceRepository.findOne(id);

    if(!menuAttendanceDto) {
      throw new NotFoundException("Atendimento não encontrado!");
    }

    return menuAttendanceDto;
  }

  async findAllByCustomer(customerId: number): Promise<MenuAttendanceDto[]> {
    return this.menuAttendanceRepository.findAllByCustomer(customerId);
  }

  async findAllByMenu(menuId: number): Promise<MenuAttendanceDto[]> {
    return this.menuAttendanceRepository.findAllByMenu(menuId);
  }
  private getTodayWeekDay(): WEEK_DAYS {
    const todayIndex = new Date().getDay();
    const days = [
      WEEK_DAYS.SUNDAY,
      WEEK_DAYS.MONDAY,
      WEEK_DAYS.TUESDAY,
      WEEK_DAYS.WEDNESDAY,
      WEEK_DAYS.THURSDAY,
      WEEK_DAYS.FRIDAY,
      WEEK_DAYS.SATURDAY,
    ];

    return days[todayIndex];
  }
}
