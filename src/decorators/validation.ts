import { applyDecorators } from '@nestjs/common'
import { Type } from 'class-transformer'
import {
	IsISO8601,
	IsNotEmpty,
	ValidationArguments,
	ValidationOptions,
	registerDecorator,
} from 'class-validator'

type SupportedTypes = 'string' | 'number' | 'boolean' | { array: 'string' | 'number' }

export function IsRequiredDate() {
	return applyDecorators(
		IsNotEmpty({ message: 'The data can not be empty' }),
		IsISO8601({}, { message: 'Invalid data fomat. Use the following ISO8601 format (YYYY-MM-DD)' }),
		Type(() => Date)
	)
}

// export function IsRequiredArrayOf(genericType: any) {
// 	return applyDecorators(
// 		IsNotEmpty(isNotEmptyMessage),
// 		IsArray(isArrayMessage),
// 		IsInstance(genericType, { message: `The data must be a ${genericType}` })
// 	)
// }

export function IsRequiredTypeOf(type: SupportedTypes, validationOptions?: ValidationOptions) {
	return function (object: object, propertyName: string) {
		registerDecorator({
			name: 'IsRequiredTypeOf',
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [type],
			validator: {
				validate(value: any, args: ValidationArguments) {
					const [expectedType] = args.constraints
					switch (expectedType) {
						case 'string':
							return typeof value === 'string' && value.trim() !== ''
						case 'number':
							return typeof value === 'number' && !isNaN(value)
						case 'boolean':
							return typeof value === 'boolean'
						case { array: 'string' }:
							return (
								Array.isArray(value) &&
								value.length > 0 &&
								value.every(item => typeof item === expectedType.array)
							)
						case { array: 'number' }:
							return (
								Array.isArray(value) &&
								value.length > 0 &&
								value.every(item => typeof item === expectedType.array)
							)
						default:
							return false
					}
				},
				defaultMessage(args: ValidationArguments) {
					const [expectedType]: [SupportedTypes] = args.constraints as [SupportedTypes]

					if (typeof expectedType === 'string') {
						return `${args.property} must be a ${expectedType}`
					}

					return `${args.property} must be a array of ${expectedType.array}`
				},
			},
		})
	}
}
