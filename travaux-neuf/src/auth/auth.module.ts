import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AADStrategy } from './strategy/AAD.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AADStrategy],
  exports:[AADStrategy]
})
export class AuthModule {}
