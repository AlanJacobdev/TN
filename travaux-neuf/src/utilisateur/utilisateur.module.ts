import { Module } from '@nestjs/common';
import { UtilisateurService } from './utilisateur.service';
import { UtilisateurController } from './utilisateur.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Utilisateur } from './entities/utilisateur.entity';
import { ServiceModule } from 'src/service/service.module';

@Module({
  imports: [TypeOrmModule.forFeature([Utilisateur]), ServiceModule],
  controllers: [UtilisateurController],
  providers: [UtilisateurService],
  exports : [UtilisateurService]
})
export class UtilisateurModule {}
