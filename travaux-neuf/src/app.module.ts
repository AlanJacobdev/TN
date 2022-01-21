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

@Module({
  imports: [TypeOrmModule.forRoot(config), ObjetrepereModule, TypeobjetrepereModule, NumerouniqueModule, AtelierModule, OrsaveModule, TypeobjetModule, ItemModule, ItemsaveModule, SousitemModule, SousitemsaveModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
