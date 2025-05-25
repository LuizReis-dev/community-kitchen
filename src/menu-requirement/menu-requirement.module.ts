import { Module } from '@nestjs/common'
import { MenuRequirementService } from './menu-requirement.service'
import { MenuRequirementController } from './menu-requirement.controller'
import { MenuRequirementRepository } from './menu-requirement.repository'
import { DatabaseModule } from 'src/database/database.module'

@Module({
	imports: [DatabaseModule],
	controllers: [MenuRequirementController],
	providers: [MenuRequirementService, MenuRequirementRepository],
	exports: [MenuRequirementService],
})
export class MenuRequirementModule {}
