import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './ormconfig';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ObjetrepereModule } from './objetrepere/objetrepere.module';
import { TypeobjetrepereModule } from './typeobjetrepere/typeobjetrepere.module';
import { NumerouniqueModule } from './numerounique/numerounique.module';
import { AtelierModule } from './atelier/atelier.module';
import { OrsaveModule } from './orsave/orsave.module';
import { TypeobjetModule } from './typeobjet/typeobjet.module';
import { ItemModule } from './item/item.module';
import { ItemsaveModule } from './itemsave/itemsave.module';
import { SousitemModule } from './sousitem/sousitem.module';
import { SousitemsaveModule } from './sousitemsave/sousitemsave.module';
import { DroitModule } from './droit/droit.module';
import { ServiceModule } from './service/service.module';
import { DroitparserviceModule } from './droitparservice/droitparservice.module';
import { UtilisateurModule } from './utilisateur/utilisateur.module';
import { DroitparutilisateurModule } from './droitparutilisateur/droitparutilisateur.module';
import { ConfigModule } from '@nestjs/config';
import { ServiceRecopieModule } from './service-recopie/service-recopie.module';
import configuration from './config';
@Module({
  imports: [TypeOrmModule.forRoot(config), ObjetrepereModule, TypeobjetrepereModule, NumerouniqueModule, AtelierModule, OrsaveModule, TypeobjetModule, ItemModule, ItemsaveModule, SousitemModule, SousitemsaveModule, DroitModule, ServiceModule, DroitparserviceModule, UtilisateurModule, DroitparutilisateurModule,
  ConfigModule.forRoot({
    isGlobal: true,
    load:[configuration]
  }),
  ServiceRecopieModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
