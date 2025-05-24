import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator'

export class CreateMenuRequirementDto {
	@ApiProperty({ example: 200, description: 'Mínimo de calorias em kcal' })
	@IsNotEmpty()
	@IsNumber()
	@Min(200)
	@Max(500)
	min_calories: number

	@ApiProperty({ example: 800, description: 'Máximo de calorias em kcal' })
	@IsNotEmpty()
	@IsNumber()
	@Min(500)
	@Max(800)
	max_calories: number

	@ApiProperty({ example: 0, description: 'Mínimo de carboidratos em g' })
	@IsNotEmpty()
	@IsNumber()
	@Min(20)
	@Max(30)
	min_carbohydrates: number

	@ApiProperty({ example: 100, description: 'Máximo de carboidratos em g' })
	@IsNotEmpty()
	@IsNumber()
	@Min(30)
	@Max(80)
	max_carbohydrates: number

	@ApiProperty({ example: 0, description: 'Mínimo de proteínas em g' })
	@IsNotEmpty()
	@IsNumber()
	@Min(5)
	@Max(15)
	min_proteins: number

	@ApiProperty({ example: 30, description: 'Máximo de proteínas em g' })
	@IsNotEmpty()
	@IsNumber()
	@Min(15)
	@Max(30)
	max_proteins: number

	@ApiProperty({ example: 0, description: 'Mínimo de gordura em g' })
	@IsNotEmpty()
	@IsNumber()
	@Min(5)
	@Max(15)
	min_fats: number

	@ApiProperty({ example: 30, description: 'Máximo de gordura em g' })
	@IsNotEmpty()
	@IsNumber()
	@Min(15)
	@Max(30)
	max_fats: number

	@ApiProperty({ example: 0, description: 'Mínimo de fibras em g' })
	@IsNotEmpty()
	@IsNumber()
	@Min(2)
	@Max(5)
	min_fiber: number

	@ApiProperty({ example: 5, description: 'Máximo de fibras em g' })
	@IsNotEmpty()
	@IsNumber()
	@Min(5)
	@Max(10)
	max_fiber: number

	@ApiProperty({ example: 0, description: 'Mínimo de açúcar em g' })
	@IsNotEmpty()
	@IsNumber()
	@Min(0)
	@Max(5)
	min_sugar: number

	@ApiProperty({ example: 25, description: 'Máximo de açúcar em g' })
	@IsNotEmpty()
	@IsNumber()
	@Min(5)
	@Max(20)
	max_sugar: number

	@ApiProperty({ example: 0, description: 'Mínimo de sódio em mg' })
	@IsNotEmpty()
	@IsNumber()
	@Min(50)
	@Max(100)
	min_sodium: number

	@ApiProperty({ example: 500, description: 'Máximo de sódio em mg' })
	@IsNotEmpty()
	@IsNumber()
	@Min(100)
	@Max(500)
	max_sodium: number
}
