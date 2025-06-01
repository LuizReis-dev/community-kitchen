import { applyDecorators } from '@nestjs/common'
import { Type } from 'class-transformer'
import {
	IsISO8601,
	IsNotEmpty,
	ValidationArguments,
	ValidationOptions,
	registerDecorator,
} from 'class-validator'
import { cpf } from 'cpf-cnpj-validator'

type SupportedTypes = 'string' | 'number' | 'boolean' | 'string[]' | 'number[]'

export function IsRequiredDate() {
	return applyDecorators(
		IsNotEmpty({ message: 'The date can not be empty' }),
		IsISO8601({}, { message: 'Invalid date format. Use ISO8601 (YYYY-MM-DD)' })
	)
}

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
						case 'string[]':
							return (
								Array.isArray(value) &&
								value.length > 0 &&
								value.every(item => typeof item === 'string')
							)
						case 'number[]':
							return (
								Array.isArray(value) &&
								value.length > 0 &&
								value.every(item => typeof item === 'number')
							)
						default:
							return false
					}
				},
				defaultMessage(args: ValidationArguments) {
					const [expectedType]: [SupportedTypes] = args.constraints as [SupportedTypes]

					return `${args.property} must be a ${expectedType} and can not be empty`
				},
			},
		})
	}
}

export function IsCpf(validationOptions?: ValidationOptions) {
	return function (object: object, propertyName: string) {
		registerDecorator({
			name: 'IsCpf',
			target: object.constructor,
			propertyName,
			options: validationOptions,
			validator: {
				validate(value: any) {
					return typeof value === 'string' && cpf.isValid(value)
				},
				defaultMessage(): string {
					return 'Invalid CPF'
				},
			},
		})
	}
}

export function IsPastDate(validationOptions?: ValidationOptions) {
	return function (object: object, propertyName: string) {
		registerDecorator({
			name: 'IsPastDate',
			target: object.constructor,
			propertyName,
			options: validationOptions,
			validator: {
				validate(value: any) {
					const date = new Date(value)
					const now = new Date()
					return !isNaN(date.getTime()) && date < now
				},
				defaultMessage(): string {
					return 'Date must be in the past'
				},
			},
		})
	}
}
