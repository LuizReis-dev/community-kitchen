import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { CreateMenuDto } from './dto/create-menu.dto'
import { UpdateMenuDto } from './dto/update-menu.dto'
import { Sequelize } from 'sequelize'
import { Menu } from './entities/menu.entity'
import { MenuDto } from './dto/menu.dto'
import { DailyEvent } from 'src/daily-event/entities/daily-event.entity'
import { WEEK_DAYS } from 'src/common/enums/week-days'
import { Op } from 'sequelize'

@Injectable()
export class MenuRepository {
	constructor(@Inject('SEQUELIZE') private sequelize: Sequelize) {}

	async create(createMenuDto: CreateMenuDto) {
		const transaction = await this.sequelize.transaction()
		try {
			const menu = await Menu.create(
				{
					...createMenuDto,
				},
				{ transaction }
			)

			const dishesIds = createMenuDto.dishes
			const eventId = createMenuDto.dailyEventId

			await menu.$set('dishes', dishesIds, { transaction })
			await menu.$set('dailyEvent', eventId, { transaction })

			menu.dishes = await menu.$get('dishes', { transaction })
			menu.dailyEvent = (await menu.$get('dailyEvent', { transaction })) as DailyEvent

			await transaction.commit()
			return MenuDto.fromEntity(menu)
		} catch (error) {
			await transaction.rollback()
			console.log(error)
			throw new BadRequestException('Error creating menu')
		}
	}

	async findAll() {
		const menus = await Menu.findAll({
			include: ['dishes', 'dailyEvent'],
		})
		return menus.map(menu => MenuDto.fromEntity(menu))
	}

	async findOne(id: number) {
		const menu = await Menu.findByPk(id, {
			include: ['dishes', 'dailyEvent'],
		})

		if (!menu) throw new NotFoundException('Menu not found')

		return MenuDto.fromEntity(menu)
	}

	async update(id: number, updateMenuDto: UpdateMenuDto) {
		const menu = await Menu.findByPk(id, {
			include: ['dishes'],
		})

		if (!menu) throw new NotFoundException('Menu not found')

		const transaction = await this.sequelize.transaction()
		try {
			await menu.update(
				{
					...updateMenuDto,
				},
				{ transaction }
			)
			const dishesIds = updateMenuDto.dishes ?? null

			await menu.$set('dishes', dishesIds, { transaction })

			menu.dishes = await menu.$get('dishes', { transaction })
			await transaction.commit()
			return MenuDto.fromEntity(menu)
		} catch {
			await transaction.rollback()
			throw new BadRequestException('Error updating menu')
		}
	}

	async remove(id: number) {
		await Menu.destroy({
			where: {
				id,
			},
		})
		return 'Menu deleted'
	}

	async countByDailyEventIdAndAvaibleDay(
		dailyEventId: number,
		availableDay: WEEK_DAYS
	): Promise<boolean> {
		const menuCount = await Menu.count({
			where: {
				dailyEventId,
				availableDay,
				deactivationDate: {
					[Op.eq]: null,
				},
			},
		})

		return menuCount > 0
	}

	async deactivateMenu(id: number): Promise<string | null> {
		const menu = await Menu.findByPk(id)

		if (!menu) return menu

		const transaction = await this.sequelize.transaction()
		try {
			await menu.update(
				{
					deactivationDate: new Date(),
				},
				{ transaction }
			)

			await transaction.commit()
			return 'Menu successfully deactivated'
		} catch {
			await transaction.rollback()
			throw new BadRequestException('Error updating menu')
		}
	}

	async listWeeklyMenus(): Promise<MenuDto[]> {
		const menus = await Menu.findAll({
			include: ['dishes', 'dailyEvent'],
			where: {
				deactivationDate: {
					[Op.eq]: null,
				},
			},
		})
		return menus.map(menu => MenuDto.fromEntity(menu))
	}

	async listMenuByWeekDay(weekDay: WEEK_DAYS): Promise<MenuDto | null> {
		const menu = await Menu.findOne({
			include: ['dishes', 'dailyEvent'],
			where: {
				availableDay: weekDay,
				deactivationDate: {
					[Op.eq]: null,
				},
			},
		})
		return menu ? MenuDto.fromEntity(menu) : menu
	}
}
