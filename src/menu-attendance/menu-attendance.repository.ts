import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { Sequelize } from 'sequelize-typescript'
import { Menu } from 'src/menu/entities/menu.entity'
import { Customer } from 'src/customer/entities/customer.entity'
import { MenuAttendance } from './entities/menu-attendance.entity'
import { MenuAttendanceDto } from './dto/menu-attendance.dto'
import { Op } from 'sequelize'
import { CreateMenuAttendanceDto } from './dto/create-menu-attendance.dto'
import { MenuAttendanceAggregationDto } from './dto/menu-attendance-aggregation.dto'

@Injectable()
export class MenuAttendanceRepository {
	constructor(@Inject('SEQUELIZE') private sequelize: Sequelize) {}

	async create(createMenuAttendanceDto: CreateMenuAttendanceDto): Promise<MenuAttendanceDto> {
		const transaction = await this.sequelize.transaction()
		try {
			const menuAttendance = await MenuAttendance.create(
				{
					customerId: createMenuAttendanceDto.customerId,
					menuId: createMenuAttendanceDto.menuId,
				},
				{ transaction }
			)

			await transaction.commit()
			const menuAttendanceWithRelations = await MenuAttendance.findByPk(menuAttendance.id, {
				include: [{ model: Menu }, { model: Customer }],
			})

			if (!menuAttendanceWithRelations) throw new Error('Ocorreu um erro inesperado')
			return MenuAttendanceDto.fromEntity(menuAttendanceWithRelations)
		} catch (e) {
			console.log(e)
			throw new BadRequestException('Erro ao registrar atendimento!')
		}
	}

	async findAll(): Promise<MenuAttendanceDto[]> {
		const menuAttendances = await MenuAttendance.findAll({
			include: [{ model: Menu }, { model: Customer }],
		})

		return menuAttendances.map(menuAttendance => MenuAttendanceDto.fromEntity(menuAttendance))
	}

	async findAllByCustomer(customerId: number): Promise<MenuAttendanceDto[]> {
		const menuAttendances = await MenuAttendance.findAll({
			where: {
				customerId,
			},
			include: [{ model: Menu }, { model: Customer }],
		})

		return menuAttendances.map(menuAttendance => MenuAttendanceDto.fromEntity(menuAttendance))
	}

	async findAllByMenu(menuId: number): Promise<MenuAttendanceDto[]> {
		const menuAttendances = await MenuAttendance.findAll({
			where: {
				menuId,
			},
			include: [{ model: Menu }, { model: Customer }],
		})

		return menuAttendances.map(menuAttendance => MenuAttendanceDto.fromEntity(menuAttendance))
	}

	async findOne(id: number): Promise<MenuAttendanceDto | null> {
		const menuAttendance = await MenuAttendance.findByPk(id, {
			include: [{ model: Menu }, { model: Customer }],
		})

		if (!menuAttendance) return null

		return MenuAttendanceDto.fromEntity(menuAttendance)
	}
	async findByCustomerIdAndDate(customerId: number, date: Date): Promise<MenuAttendance | null> {
		const startOfDay = new Date(date)
		startOfDay.setHours(0, 0, 0, 0)

		const endOfDay = new Date(date)
		endOfDay.setHours(23, 59, 59, 999)

		return MenuAttendance.findOne({
			where: {
				customerId,
				createdAt: {
					[Op.between]: [startOfDay, endOfDay],
				},
			},
		})
	}

	async aggregateByMenu(): Promise<MenuAttendanceAggregationDto[]> {
		const menuAttendancesAggregation = (await MenuAttendance.findAll({
			attributes: ['menuId', [Sequelize.fn('COUNT', Sequelize.col('id')), 'attendanceCount']],
			group: ['menu_id'],
			raw: true,
		})) as unknown as MenuAttendanceAggregationDto[]

		return menuAttendancesAggregation
	}
}
