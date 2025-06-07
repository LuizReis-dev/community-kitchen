import { Injectable, UnauthorizedException } from '@nestjs/common'
import axios from 'axios'
import { TokenValidator } from '../interfaces/token-validator.interface'
import { User } from '../interfaces/user.interface'

@Injectable()
export class RemoteTokenValidator implements TokenValidator {
	async validateToken(token: string): Promise<User> {
		try {
			const response = await axios.post<{ user: User }>(
				process.env.REMOTE_TOKEN_VALIDATOR_URL ?? '',
				{},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			)
			return response.data.user
		} catch (error) {
			throw new UnauthorizedException('Token inválido ou expirado')
		}
	}
}
