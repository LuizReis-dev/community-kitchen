import { IsNotEmpty, IsNumber, Min } from 'class-validator'

export class CreateMenuRequirementDto {
	@IsNotEmpty()
	@IsNumber()
	@Min(0)
	calories: number

	@IsNotEmpty()
	@IsNumber()
	@Min(0)
	carbohydrates: number

	@IsNotEmpty()
	@IsNumber()
	@Min(0)
	proteins: number

	@IsNotEmpty()
	@IsNumber()
	@Min(0)
	fats: number

	@IsNotEmpty()
	@IsNumber()
	@Min(0)
	fiber: number

	@IsNotEmpty()
	@IsNumber()
	@Min(0)
	sugar: number

	@IsNotEmpty()
	@IsNumber()
	@Min(0)
	sodium: number
}
