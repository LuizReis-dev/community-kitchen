import { PartialType } from '@nestjs/mapped-types';
import { CreateMenuRequirementDto } from './create-menu-requirement.dto';

export class UpdateMenuRequirementDto extends PartialType(CreateMenuRequirementDto) {}
