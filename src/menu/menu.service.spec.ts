import { Test, TestingModule } from '@nestjs/testing'
import { DailyEventRepository } from 'src/daily-event/daily-event.repository'
import { DailyEventService } from 'src/daily-event/daily-event.service'
import { DishService } from 'src/dish/dish.service'
import { MenuRepository } from './menu.repository'
import { MenuService } from './menu.service'

describe('MenuService', () => {
	let service: MenuService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				MenuService,
				{ provide: DailyEventRepository, useValue: {} },
				{ provide: MenuRepository, useValue: {} },
				{ provide: DishService, useValue: {} },
				{ provide: DailyEventService, useValue: {} },
			],
		}).compile()

		service = module.get<MenuService>(MenuService)
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
	})
})
