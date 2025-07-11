import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { CreateMenuDto } from './dto/create-menu.dto'
import { UpdateMenuDto } from './dto/update-menu.dto'
import { Op, Sequelize } from 'sequelize'
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
			include: [
				{
					association: 'dishes',
					include: [
						{
							association: 'foods',
							include: [
								{
									association: 'nutritionFacts',
								},
							],
						},
					],
				},
				'dailyEvent',
			],
		})
		return menus.map(menu => MenuDto.fromEntity(menu))
	}

	async findOne(id: number) {
		const menu = await Menu.findByPk(id, {
			include: [
				{
					association: 'dishes',
					include: [
						{
							association: 'foods',
							include: [
								{
									association: 'nutritionFacts',
								},
							],
						},
					],
				},
				'dailyEvent',
			],
		})

		return menu ? MenuDto.fromEntity(menu) : null
	}

	async update(id: number, updateMenuDto: UpdateMenuDto) {
		const transaction = await this.sequelize.transaction()
		try {
			const [_, affectedRows] = await Menu.update(
				{
					...updateMenuDto,
				},
				{ transaction, where: { id }, returning: true }
			)
			const dishesIds = updateMenuDto.dishes ?? null
			const dailyEventId = updateMenuDto.dailyEventId ?? null
			const menu = affectedRows[0]

			if (dishesIds) {
				await menu.$set('dishes', dishesIds, { transaction })
				menu.dishes = await menu.$get('dishes', { transaction })
			}
			if (dailyEventId) {
				await menu.$set('dailyEvent', dailyEventId, { transaction })
				menu.dailyEvent = (await menu.$get('dailyEvent', { transaction })) as DailyEvent
			}

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

	async listWeeklyMenus(): Promise<Record<WEEK_DAYS, MenuDto[]>> {
		const menus = await Menu.findAll({
			include: [
				{
					association: 'dishes',
					include: [
						{
							association: 'foods',
							include: [
								{
									association: 'nutritionFacts',
								},
							],
						},
					],
				},
				'dailyEvent',
			],
			where: {
				deactivationDate: {
					[Op.eq]: null,
				},
			},
		})
		return MenuDto.fromEntitiesGroupedByDay(menus)
	}

	async listMenuByWeekDay(weekDay: WEEK_DAYS): Promise<MenuDto[] | null> {
		const menu = await Menu.findAll({
			include: [
				{
					association: 'dishes',
					include: [
						{
							association: 'foods',
							include: [
								{
									association: 'nutritionFacts',
								},
							],
						},
					],
				},
				'dailyEvent',
			],
			where: {
				availableDay: weekDay,
				deactivationDate: {
					[Op.eq]: null,
				},
			},
		})

		return menu.length > 0 ? menu.map(menu => MenuDto.fromEntity(menu)) : null
	}

	async findUsedDailyEventIds(): Promise<number[]> {
		const usedMenus = await Menu.findAll({
			attributes: ['dailyEventId'],
			where: {
				availableDay: {
					[Op.not]: null,
				},
			},
			group: ['dailyEventId'],
			raw: true,
		})
		return usedMenus.map(m => m.dailyEventId)
	}

	async findAssignedDaysByDailyEvent(): Promise<
		{ dailyEventId: number; availableDay: WEEK_DAYS }[]
	> {
		const assignedDays = await Menu.findAll({
			attributes: ['dailyEventId', 'availableDay'],
			where: {
				dailyEventId: { [Op.not]: null },
				availableDay: {
					[Op.not]: null,
					[Op.in]: Object.values(WEEK_DAYS),
				},
				deactivationDate: {
					[Op.eq]: null,
				},
			},
			group: ['dailyEventId', 'availableDay'],
			raw: true,
		})

		return assignedDays.map(item => ({
			dailyEventId: item.dailyEventId,
			availableDay: item.availableDay as WEEK_DAYS,
		}))
	}

	async getMenuByDailyEventAndWeekDay(
		dailyEventId: number,
		weekDay: string
	): Promise<MenuDto | null> {
		const menu = await Menu.findOne({
			include: [
				{
					association: 'dishes',
					include: [
						{
							association: 'foods',
							include: [
								{
									association: 'nutritionFacts',
								},
							],
						},
					],
				},
				'dailyEvent',
			],
			where: {
				dailyEventId,
				availableDay: weekDay as WEEK_DAYS,
				deactivationDate: {
					[Op.eq]: null,
				},
			},
		})
		return menu ? MenuDto.fromEntity(menu) : null
	}
	async getMenuByDailyEvent(dailyEventId: number): Promise<MenuDto[] | null> {
		const menus = await Menu.findAll({
			include: [
				{
					association: 'dishes',
					include: [
						{
							association: 'foods',
							include: [
								{
									association: 'nutritionFacts',
								},
							],
						},
					],
				},
				'dailyEvent',
			],
			where: {
				dailyEventId,
				deactivationDate: {
					[Op.eq]: null,
				},
			},
		})
		return menus.length > 0 ? menus.map(menu => MenuDto.fromEntity(menu)) : null
	}
}
