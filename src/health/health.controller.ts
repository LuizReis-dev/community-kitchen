import { Controller, Get } from '@nestjs/common'
import { Public } from 'src/common/decorators/public'

@Controller('health')
export class HealthController {
	@Public()
	@Get()
	check(): { status: string } {
		return { status: 'ok' }
	}
}
