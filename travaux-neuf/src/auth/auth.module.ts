import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UtilisateurModule } from 'src/utilisateur/utilisateur.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtKey } from './constants';
import { LocalStrategy } from './strategy/local.strategy';
import { AADStrategy } from './strategy/AAD.strategy';

@Module({
  imports : [UtilisateurModule,
    JwtModule.register({
      secret: jwtKey.secret,
      signOptions: { expiresIn: '30m' },
    }),],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, AADStrategy],
  exports:[AuthService, AADStrategy]
})
export class AuthModule {}
