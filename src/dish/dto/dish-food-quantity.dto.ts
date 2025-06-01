import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsNumber, Min } from "class-validator";


export class DishFoodQuantityDto{

    @ApiProperty()
    @IsInt({message: 'O ID precisa ser inteiro.'})
    @IsNotEmpty({ message: 'ID nao pode ser vazio.' })
    @Min(1)
	foodId: number;

	@ApiProperty({
		description: 'Quantidade do ingrediente presente no prato em gramas.',
		example: 80,
	})
    @IsNumber()
    @IsNotEmpty({ message: 'Quantidade nao pode ser vazio.' })
	@Min(0.1)
	quantity: number;
}