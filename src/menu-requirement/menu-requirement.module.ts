import { Module } from '@nestjs/common';
import { MenuRequirementService } from './menu-requirement.service';
import { MenuRequirementController } from './menu-requirement.controller';
import { MenuRequirementRepository } from './menu-requirement.repository';

@Module({
  controllers: [MenuRequirementController],
  providers: [MenuRequirementService, MenuRequirementRepository],
})
export class MenuRequirementModule {}
