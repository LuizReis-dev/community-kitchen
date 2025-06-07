import { ApiProperty } from '@nestjs/swagger'
import {
	IsString,
	IsArray,
	IsNumber,
	IsOptional,
	IsNotEmpty,
	ArrayNotEmpty,
	ArrayMaxSize,
	MaxLength,
	ArrayUnique,
	isString,
	ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'
import { DishFoodQuantityDto } from './dish-food-quantity.dto'

export class CreateDishDto {
	@ApiProperty({
		description: 'Nome do prato.',
		example: 'Frango grelhado com salada.',
	})
	@IsString({ message: 'Nome deve ser uma string.' })
	@IsNotEmpty({ message: 'Nome nao pode ser vazio.' })
	@MaxLength(100, { message: 'O nome nao pode possuir mais do que 100 caracteres.' })
	name: string

	@ApiProperty({
		description: 'Descricao do prato',
		example: 'Frango grelhado servido ao molho madeira, acompanhado de arroz, feijao e salada.',
	})
	@IsString({ message: 'Descricao deve ser uma string' })
	@MaxLength(255, { message: 'Descricao nao pode ter mais do que 255 catacteres' })
	@IsNotEmpty({ message: 'Descricao nao pode ser vazio.' })
	description: string

	@ApiProperty({
		description: 'Array de ingredientes com suas quantidades.',
		type: [DishFoodQuantityDto],
		example: [
			{ foodId: 1, quantity: 200 },
			{ foodId: 2, quantity: 100 },
		],
	})
	@IsArray({ message: 'Foods deve ser um array.' })
	@ArrayNotEmpty({ message: 'Foods nao pode ser vazio.' })
	@ArrayMaxSize(50, { message: 'Foods nao pode conter mais de 50 ingredientes.' })
	@ValidateNested({ each: true })
	@ArrayUnique(item => item.foodId, { message: 'FoodIds precisam ser únicos.' })
	@Type(() => DishFoodQuantityDto)
	foods: DishFoodQuantityDto[]
}
