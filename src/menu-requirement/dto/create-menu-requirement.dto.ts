import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class CreateMenuRequirementDto {
	@ApiProperty({ example: 200, description: 'Mínimo de calorias em kcal' })
	@IsNotEmpty()
	@IsNumber()
	min_calories: number

	@ApiProperty({ example: 800, description: 'Máximo de calorias em kcal' })
	@IsNotEmpty()
	@IsNumber()
	max_calories: number

	@ApiProperty({ example: 20, description: 'Mínimo de carboidratos em g' })
	@IsNotEmpty()
	@IsNumber()
	min_carbohydrates: number

	@ApiProperty({ example: 80, description: 'Máximo de carboidratos em g' })
	@IsNotEmpty()
	@IsNumber()
	max_carbohydrates: number

	@ApiProperty({ example: 5, description: 'Mínimo de proteínas em g' })
	@IsNotEmpty()
	@IsNumber()
	min_proteins: number

	@ApiProperty({ example: 30, description: 'Máximo de proteínas em g' })
	@IsNotEmpty()
	@IsNumber()
	max_proteins: number

	@ApiProperty({ example: 5, description: 'Mínimo de gordura em g' })
	@IsNotEmpty()
	@IsNumber()
	min_fats: number

	@ApiProperty({ example: 30, description: 'Máximo de gordura em g' })
	@IsNotEmpty()
	@IsNumber()
	max_fats: number

	@ApiProperty({ example: 2, description: 'Mínimo de fibras em g' })
	@IsNotEmpty()
	@IsNumber()
	min_fiber: number

	@ApiProperty({ example: 5, description: 'Máximo de fibras em g' })
	@IsNotEmpty()
	@IsNumber()
	max_fiber: number

	@ApiProperty({ example: 0, description: 'Mínimo de açúcar em g' })
	@IsNotEmpty()
	@IsNumber()
	min_sugar: number

	@ApiProperty({ example: 20, description: 'Máximo de açúcar em g' })
	@IsNotEmpty()
	@IsNumber()
	max_sugar: number

	@ApiProperty({ example: 50, description: 'Mínimo de sódio em mg' })
	@IsNotEmpty()
	@IsNumber()
	min_sodium: number

	@ApiProperty({ example: 500, description: 'Máximo de sódio em mg' })
	@IsNotEmpty()
	@IsNumber()
	max_sodium: number
}
