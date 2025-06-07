import { PartialType } from '@nestjs/mapped-types'
import { CreateMenuRequirementDto } from './create-menu-requirement.dto'
import { IsBoolean, IsNumber, IsOptional, Max, Min } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateMenuRequirementDto extends PartialType(CreateMenuRequirementDto) {
	@ApiProperty({ example: 200, description: 'Mínimo de calorias em kcal' })
	@IsOptional()
	@IsNumber()
	minCalories: number

	@ApiProperty({ example: 800, description: 'Máximo de calorias em kcal' })
	@IsOptional()
	@IsNumber()
	maxCalories: number

	@ApiProperty({ example: 0, description: 'Mínimo de carboidratos em g' })
	@IsOptional()
	@IsNumber()
	minCarbohydrates: number

	@ApiProperty({ example: 100, description: 'Máximo de carboidratos em g' })
	@IsOptional()
	@IsNumber()
	maxCarbohydrates: number

	@ApiProperty({ example: 0, description: 'Mínimo de proteínas em g' })
	@IsOptional()
	@IsNumber()
	minProteins: number

	@ApiProperty({ example: 30, description: 'Máximo de proteínas em g' })
	@IsOptional()
	@IsNumber()
	maxProteins: number

	@ApiProperty({ example: 0, description: 'Mínimo de fibras em g' })
	@IsOptional()
	@IsNumber()
	minFiber: number

	@ApiProperty({ example: 5, description: 'Máximo de fibras em g' })
	@IsOptional()
	@IsNumber()
	maxFiber: number

	@ApiProperty({ example: 0, description: 'Mínimo de gordura em g' })
	@IsOptional()
	@IsNumber()
	minFats: number

	@ApiProperty({ example: 30, description: 'Máximo de gordura em g' })
	@IsOptional()
	@IsNumber()
	maxFats: number

	@ApiProperty({ example: 0, description: 'Mínimo de açúcar em g' })
	@IsOptional()
	@IsNumber()
	minSugar: number

	@ApiProperty({ example: 25, description: 'Máximo de açúcar em g' })
	@IsOptional()
	@IsNumber()
	maxSugar: number

	@ApiProperty({ example: 0, description: 'Mínimo de sódio em mg' })
	@IsOptional()
	@IsNumber()
	minSodium: number

	@ApiProperty({ example: 500, description: 'Máximo de sódio em mg' })
	@IsOptional()
	@IsNumber()
	maxSodium: number

	@ApiProperty({
		example: false,
		description: 'As especificações devem estar ativas ou desativadas.',
	})
	@IsOptional()
	@IsBoolean()
	isActive: boolean
}
