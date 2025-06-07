import { ApiProperty } from '@nestjs/swagger'
import { DishDto } from 'src/dish/dto/dish.dto'
import { Menu } from '../entities/menu.entity'
import { DailyEventDto } from 'src/daily-event/dto/daily-event.dto'
import { WEEK_DAYS } from 'src/common/enums/week-days'

export class MenuDto {
	constructor(
		id: number,
		deactivationDate: Date,
		activationDate: Date,
		availableDay: string,
		dailyEvent: DailyEventDto,
		createdBy: string,
		dishes: DishDto[]
	) {
		this.id = id
		this.createdBy = createdBy
		this.deactivationDate = deactivationDate
		this.activationDate = activationDate
		this.availableDay = availableDay
		this.dailyEvent = dailyEvent
		this.dishes = dishes
	}

	@ApiProperty()
	id: number

	@ApiProperty()
	deactivationDate: Date

	@ApiProperty()
	activationDate: Date

	@ApiProperty()
	availableDay: string

	@ApiProperty()
	createdBy: string

	@ApiProperty({ type: [DishDto] })
	dishes: DishDto[]

	@ApiProperty({ type: DailyEventDto })
	dailyEvent: DailyEventDto

	static fromEntity(menu: Menu): MenuDto {
		const dishes = menu.dishes.map(dish => DishDto.fromEntity(dish))
		const dailyEvent = DailyEventDto.fromEntity(menu.dailyEvent)
		const deactivationDate = menu.deactivationDate
		const activationDate = menu.activationDate
		const availableDay = menu.availableDay
		const createdBy = menu.createdBy
		const id = menu.id

		return new MenuDto(
			id,
			deactivationDate,
			activationDate,
			availableDay,
			dailyEvent,
			createdBy,
			dishes
		)
	}

	static fromEntitiesGroupedByDay(menus: Menu[]): Record<WEEK_DAYS, MenuDto[]> {
		const groupedMenus: Record<WEEK_DAYS, MenuDto[]> = {} as Record<WEEK_DAYS, MenuDto[]>

		for (const menu of menus) {
			const day = menu.availableDay
			if (!groupedMenus[day]) {
				groupedMenus[day] = []
			}
			groupedMenus[day].push(MenuDto.fromEntity(menu))
		}

		return groupedMenus
	}
}
