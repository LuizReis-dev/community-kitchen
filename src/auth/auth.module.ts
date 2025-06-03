import { Module } from '@nestjs/common';
import { RemoteTokenValidator } from './services/remote-token-validator.service';

@Module({
  providers: [
    {
      provide: 'TokenValidator',
      useClass: RemoteTokenValidator,
    },
  ],
  exports: ['TokenValidator'],
})
export class AuthModule { }