import { Module } from '@nestjs/common';
import { UtilisateurService } from './utilisateur.service';
import { UtilisateurController } from './utilisateur.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Utilisateur } from './entities/utilisateur.entity';
import { ServiceModule } from 'src/service/service.module';
import { PassportModule } from '@nestjs/passport';
import { RoleModule } from 'src/role/role.module';

@Module({
  imports: [TypeOrmModule.forFeature([Utilisateur]), ServiceModule, PassportModule, RoleModule],
  controllers: [UtilisateurController],
  providers: [UtilisateurService],
  exports : [UtilisateurService]
})
export class UtilisateurModule {}
