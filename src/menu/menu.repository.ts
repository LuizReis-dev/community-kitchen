import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { CreateMenuDto } from './dto/create-menu.dto'
import { UpdateMenuDto } from './dto/update-menu.dto'
import { Sequelize } from 'sequelize'
import { Menu } from './entities/menu.entity'
import { MenuDto } from './dto/menu.dto'
import { DailyEvent } from 'src/daily-event/entities/daily-event.entity'
import { WEEK_DAYS } from 'src/common/enums/week-days'

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
			include: ['dishes'],
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
			},
		})

		return menuCount > 0
	}
}
