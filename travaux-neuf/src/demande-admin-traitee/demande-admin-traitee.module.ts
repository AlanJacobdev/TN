import { Module } from '@nestjs/common';
import { DemandeAdminTraiteeService } from './demande-admin-traitee.service';
import { DemandeAdminTraiteeController } from './demande-admin-traitee.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DemandeAdminTraitee } from './entities/demande-admin-traitee.entity';
import { OrsaveModule } from 'src/orsave/orsave.module';
import { ItemsaveModule } from 'src/itemsave/itemsave.module';
import { SousitemsaveModule } from 'src/sousitemsave/sousitemsave.module';
import { UtilisateurModule } from 'src/utilisateur/utilisateur.module';

@Module({
  imports: [TypeOrmModule.forFeature([DemandeAdminTraitee]), OrsaveModule, ItemsaveModule, SousitemsaveModule, UtilisateurModule],
  controllers: [DemandeAdminTraiteeController],
  providers: [DemandeAdminTraiteeService],
  exports: [DemandeAdminTraiteeService]
})
export class DemandeAdminTraiteeModule {}
