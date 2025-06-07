import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class CreateMenuRequirementDto {
	@ApiProperty({ example: 200, description: 'Mínimo de calorias em kcal' })
	@IsNotEmpty()
	@IsNumber()
	minCalories: number

	@ApiProperty({ example: 800, description: 'Máximo de calorias em kcal' })
	@IsNotEmpty()
	@IsNumber()
	maxCalories: number

	@ApiProperty({ example: 20, description: 'Mínimo de carboidratos em g' })
	@IsNotEmpty()
	@IsNumber()
	minCarbohydrates: number

	@ApiProperty({ example: 80, description: 'Máximo de carboidratos em g' })
	@IsNotEmpty()
	@IsNumber()
	maxCarbohydrates: number

	@ApiProperty({ example: 5, description: 'Mínimo de proteínas em g' })
	@IsNotEmpty()
	@IsNumber()
	minProteins: number

	@ApiProperty({ example: 30, description: 'Máximo de proteínas em g' })
	@IsNotEmpty()
	@IsNumber()
	maxProteins: number

	@ApiProperty({ example: 2, description: 'Mínimo de fibras em g' })
	@IsNotEmpty()
	@IsNumber()
	minFiber: number

	@ApiProperty({ example: 5, description: 'Máximo de fibras em g' })
	@IsNotEmpty()
	@IsNumber()
	maxFiber: number

	@ApiProperty({ example: 5, description: 'Mínimo de gordura em g' })
	@IsNotEmpty()
	@IsNumber()
	minFats: number

	@ApiProperty({ example: 30, description: 'Máximo de gordura em g' })
	@IsNotEmpty()
	@IsNumber()
	maxFats: number

	@ApiProperty({ example: 0, description: 'Mínimo de açúcar em g' })
	@IsNotEmpty()
	@IsNumber()
	minSugar: number

	@ApiProperty({ example: 20, description: 'Máximo de açúcar em g' })
	@IsNotEmpty()
	@IsNumber()
	maxSugar: number

	@ApiProperty({ example: 50, description: 'Mínimo de sódio em mg' })
	@IsNotEmpty()
	@IsNumber()
	minSodium: number

	@ApiProperty({ example: 500, description: 'Máximo de sódio em mg' })
	@IsNotEmpty()
	@IsNumber()
	maxSodium: number
}
