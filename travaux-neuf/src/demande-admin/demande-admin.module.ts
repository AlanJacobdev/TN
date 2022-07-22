import { GatewayTimeoutException, Module } from '@nestjs/common';
import { DemandeAdminService } from './demande-admin.service';
import { DemandeAdminController } from './demande-admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DemandeAdmin } from './entities/demande-admin.entity';
import { ObjetrepereModule } from 'src/objetrepere/objetrepere.module';
import { ItemModule } from 'src/item/item.module';
import { SousitemModule } from 'src/sousitem/sousitem.module';
import { MailModule } from 'src/mail/mail.module';
import { UtilisateurModule } from 'src/utilisateur/utilisateur.module';
import { ServiceSuppressionModule } from 'src/service-suppression/service-suppression.module';
import { DemandeAdminTraiteeModule } from 'src/demande-admin-traitee/demande-admin-traitee.module';

@Module({
  imports: [TypeOrmModule.forFeature([DemandeAdmin]), ObjetrepereModule, ItemModule, SousitemModule, MailModule, UtilisateurModule, ServiceSuppressionModule, DemandeAdminTraiteeModule],
  controllers: [DemandeAdminController],
  providers: [DemandeAdminService],
  exports : [DemandeAdminService]
})
export class DemandeAdminModule {}
