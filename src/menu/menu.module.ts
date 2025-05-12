import { Module } from '@nestjs/common'
import { MenuService } from './menu.service'
import { MenuController } from './menu.controller'
import { DatabaseModule } from 'src/database/database.module'
import { MenuRepository } from './menu.repository'

@Module({
	imports: [DatabaseModule],
	controllers: [MenuController],
	providers: [MenuService, MenuRepository],
})
export class MenuModule {}
