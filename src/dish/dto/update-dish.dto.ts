import { PartialType } from '@nestjs/mapped-types';
import { CreateDishDto } from './create-dish.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional, MaxLength, ArrayNotEmpty, ArrayMaxSize, ArrayUnique, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { DishFoodQuantityDto } from './dish-food-quantity.dto';

export class UpdateDishDto extends PartialType(CreateDishDto) {
    @ApiProperty({
        description: 'Nome do prato.',
        required: false,
        example: 'Frango grelhado com salada.',
    })
    @IsString({ message: 'Nome deve ser uma string.' })
    @MaxLength(100, { message: 'O nome não pode possuir mais do que 100 caracteres.' })
    @IsOptional()
    name?: string;

    @ApiProperty({
        description: 'Descrição do prato.',
        required: false,
        example: 'Frango grelhado servido ao molho madeira, acompanhado de arroz, feijão e salada.',
    })
    @IsString({ message: 'Descrição deve ser uma string.' })
    @MaxLength(255, { message: 'Descrição não pode ter mais do que 255 caracteres.' })
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: 'Array de ingredientes com suas quantidades.',
        type: [DishFoodQuantityDto],
        required: false,
        example: [
            { foodId: 1, quantity: 200 },
            { foodId: 2, quantity: 100 },
        ],
    })
    @IsArray({ message: 'Foods deve ser um array.' })
    @ArrayNotEmpty({ message: 'Foods não pode ser vazio.' })
    @ArrayMaxSize(50, { message: 'Foods não pode conter mais de 50 ingredientes.' })
    @ValidateNested({ each: true })
    @ArrayUnique((item: DishFoodQuantityDto) => item.foodId, { message: 'FoodIds precisam ser únicos.' })
    @Type(() => DishFoodQuantityDto)
    @IsOptional()
    foods?: DishFoodQuantityDto[];
}