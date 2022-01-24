import { Module } from '@nestjs/common';
import { DroitparutilisateurService } from './droitparutilisateur.service';
import { DroitparutilisateurController } from './droitparutilisateur.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Droitparutilisateur } from './entities/droitparutilisateur.entity';
import { UtilisateurModule } from 'src/utilisateur/utilisateur.module';
import { DroitModule } from 'src/droit/droit.module';

@Module({
  imports:[TypeOrmModule.forFeature([Droitparutilisateur]),UtilisateurModule, DroitModule],
  controllers: [DroitparutilisateurController],
  providers: [DroitparutilisateurService],
  exports :[DroitparutilisateurService]
})
export class DroitparutilisateurModule {}
