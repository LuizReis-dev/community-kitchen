import { PartialType } from '@nestjs/mapped-types'
import { CreateMenuRequirementDto } from './create-menu-requirement.dto'
import { IsBoolean, IsNumber, IsOptional, Max, Min } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateMenuRequirementDto extends PartialType(CreateMenuRequirementDto) {
	@ApiProperty({ example: 200, description: 'Mínimo de calorias em kcal' })
	@IsOptional()
	@IsNumber()
	min_calories: number

	@ApiProperty({ example: 800, description: 'Máximo de calorias em kcal' })
	@IsOptional()
	@IsNumber()
	max_calories: number

	@ApiProperty({ example: 0, description: 'Mínimo de carboidratos em g' })
	@IsOptional()
	@IsNumber()
	min_carbohydrates: number

	@ApiProperty({ example: 100, description: 'Máximo de carboidratos em g' })
	@IsOptional()
	@IsNumber()
	max_carbohydrates: number

	@ApiProperty({ example: 0, description: 'Mínimo de proteínas em g' })
	@IsOptional()
	@IsNumber()
	min_proteins: number

	@ApiProperty({ example: 30, description: 'Máximo de proteínas em g' })
	@IsOptional()
	@IsNumber()
	max_proteins: number

	@ApiProperty({ example: 0, description: 'Mínimo de gordura em g' })
	@IsOptional()
	@IsNumber()
	min_fats: number

	@ApiProperty({ example: 30, description: 'Máximo de gordura em g' })
	@IsOptional()
	@IsNumber()
	max_fats: number

	@ApiProperty({ example: 0, description: 'Mínimo de fibras em g' })
	@IsOptional()
	@IsNumber()
	min_fiber: number

	@ApiProperty({ example: 5, description: 'Máximo de fibras em g' })
	@IsOptional()
	@IsNumber()
	max_fiber: number

	@ApiProperty({ example: 0, description: 'Mínimo de açúcar em g' })
	@IsOptional()
	@IsNumber()
	min_sugar: number

	@ApiProperty({ example: 25, description: 'Máximo de açúcar em g' })
	@IsOptional()
	@IsNumber()
	max_sugar: number

	@ApiProperty({ example: 0, description: 'Mínimo de sódio em mg' })
	@IsOptional()
	@IsNumber()
	min_sodium: number

	@ApiProperty({ example: 500, description: 'Máximo de sódio em mg' })
	@IsOptional()
	@IsNumber()
	max_sodium: number

	@ApiProperty({
		example: false,
		description: 'As especificações devem estar ativas ou desativadas.',
	})
	@IsOptional()
	@IsBoolean()
	is_active: boolean
}
