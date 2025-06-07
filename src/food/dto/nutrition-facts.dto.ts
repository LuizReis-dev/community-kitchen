import { ApiProperty } from '@nestjs/swagger'
import { NutritionFacts } from '../entities/nutrition-facts.entity'

export class NutritionFactsDto {
	@ApiProperty({
		description: 'Quantidade de calorias (kcal) — calculada automaticamente, não enviar no POST',
		example: 111,
		readOnly: true, // Indica que é somente leitura no Swagger
	})
	calories: number

	@ApiProperty({
		description: 'Quantidade de carboidratos (g) em 100g',
		example: 23,
	})
	carbohydrates: number

	@ApiProperty({
		description: 'Quantidade de proteínas (g) em 100g',
		example: 2.6,
	})
	proteins: number

	@ApiProperty({
		description: 'Quantidade de gorduras totais (g) em 100g',
		example: 0.9,
	})
	fats: number

	@ApiProperty({
		description: 'Quantidade de fibras (g) em 100g',
		example: 1.8,
	})
	fiber: number

	@ApiProperty({
		description: 'Quantidade de açúcares (g) em 100g',
		example: 0.2,
	})
	sugar: number

	@ApiProperty({
		description: 'Quantidade de sódio (mg) em 100g',
		example: 5,
	})
	sodium: number

	constructor(
		calories: number,
		carbohydrates: number,
		proteins: number,
		fats: number,
		fiber: number,
		sugar: number,
		sodium: number
	) {
		this.calories = calories
		this.carbohydrates = carbohydrates
		this.proteins = proteins
		this.fats = fats
		this.fiber = fiber
		this.sugar = sugar
		this.sodium = sodium
	}

	static isValid(obj: NutritionFactsDto): boolean {
		if (!obj) return false
		const fields = [obj.carbohydrates, obj.proteins, obj.fats, obj.fiber, obj.sugar, obj.sodium]

		return fields.every(v => v !== null && v !== undefined)
	}

	static fromEntity(nutritionFacts: NutritionFacts): NutritionFactsDto {
		return new NutritionFactsDto(
			nutritionFacts.calories,
			nutritionFacts.carbohydrates,
			nutritionFacts.proteins,
			nutritionFacts.fats,
			nutritionFacts.fiber,
			nutritionFacts.sugar,
			nutritionFacts.sodium
		)
	}
}
