import { AppService } from './app.service'

describe('AppService', () => {
	it('should return the welcome message', () => {
		const service = new AppService()

		expect(service.getHello()).toBe('Hello World!')
	})
})
