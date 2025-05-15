import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsArray, IsNumber, IsOptional, IsNotEmpty, ArrayNotEmpty, ArrayMaxSize, MaxLength, ArrayUnique, isString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDishDto {
	@ApiProperty({
	description: 'Nome do prato.',
	example: 'Frango grelhado com salada.'
	})
	@IsString({message: 'Nome deve ser uma string.'})
	@IsNotEmpty({message: 'Nome nao pode ser vazio.'})
	@MaxLength(100, {message: 'O nome nao pode possuir mais do que 100 caracteres.'})
	name: string

	@ApiProperty({
    description: 'Descricao do prato',
    example: 'Frango grelhado servido ao molho madeira, acompanhado de arroz, feijao e salada.',
  })
	@IsString({ message: 'Descricao deve ser uma string' })
	@MaxLength(255, { message: 'Descricao nao pode ter mais do que 255 catacteres' })
	@IsNotEmpty({message: 'Descricao nao pode ser vazio.'})
	description: string;

	@ApiProperty({
		description: 'Array de FoodIds utilizado no prato.',
		type: [Number],
		example: [1, 2, 3],
	})
	@IsArray({ message: 'Deve ser um Array.' })
	@ArrayNotEmpty({ message: 'O array nao pode ser vazio.' })
	@ArrayMaxSize(50, { message: 'O array nao pode exceder 50 ingredientes.' })
	@IsNumber({ allowNaN: false, allowInfinity: false }, { each: true, message: 'Cada FoodId precisa ser um numero.' })
	@ArrayUnique({ message: 'FoodIds precisam ser unicos.' })
	@Type(() => Number)
	foodIds: number[];
}
