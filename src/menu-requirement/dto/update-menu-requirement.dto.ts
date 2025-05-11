import { PartialType } from '@nestjs/mapped-types';
import { CreateMenuRequirementDto } from './create-menu-requirement.dto';
import { IsNumber, IsOptional, Min, validateSync } from 'class-validator';

export class UpdateMenuRequirementDto extends PartialType(
  CreateMenuRequirementDto,
) {
  @IsOptional()
  @IsNumber()
  @Min(0)
  calories?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  carbohydrates?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  proteins?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  fats?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  fiber?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  sugar?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  sodium?: number;
}
