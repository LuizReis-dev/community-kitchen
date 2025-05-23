import { PartialType } from '@nestjs/mapped-types'
import { CreateDishDto } from './create-dish.dto'
import { ApiProperty } from '@nestjs/swagger'
import {
	IsString,
	IsArray,
	IsNumber,
	IsOptional,
	MaxLength,
	ArrayMaxSize,
	ArrayUnique,
	ArrayNotEmpty,
} from 'class-validator'
import { Type } from 'class-transformer'

export class UpdateDishDto extends PartialType(CreateDishDto) {
	@ApiProperty({
		description: 'Nome do prato.',
		required: false,
		example: 'Frango grelhado com salada.',
	})
	@IsString({ message: 'Nome deve ser uma string.' })
	@MaxLength(100, { message: 'O nome não pode possuir mais do que 100 caracteres.' })
	@IsOptional()
	name?: string

	@ApiProperty({
		description: 'Descrição do prato.',
		required: false,
		example: 'Frango grelhado servido ao molho madeira, acompanhado de arroz, feijão e salada.',
	})
	@IsString({ message: 'Descrição deve ser uma string.' })
	@MaxLength(255, { message: 'Descrição não pode ter mais do que 255 caracteres.' })
	@IsOptional()
	description?: string

	@ApiProperty({
		description: 'Array de FoodIds utilizado no prato.',
		type: [Number],
		required: false,
		example: [1, 2, 3],
	})
	@IsArray({ message: 'Deve ser um Array.' })
	@ArrayNotEmpty({ message: 'O array não pode ser vazio.' })
	@ArrayMaxSize(50, { message: 'O array não pode exceder 50 ingredientes.' })
	@IsNumber(
		{ allowNaN: false, allowInfinity: false },
		{ each: true, message: 'Cada FoodId precisa ser um número.' }
	)
	@ArrayUnique({ message: 'FoodIds precisam ser únicos.' })
	@Type(() => Number)
	@IsOptional()
	foodIds?: number[]
}
