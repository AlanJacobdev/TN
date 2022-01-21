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
import { TypeModule } from './type/type.module';
import { TypeobjetModule } from './typeobjet/typeobjet.module';

@Module({
  imports: [TypeOrmModule.forRoot(config), ObjetrepereModule, TypeobjetrepereModule, NumerouniqueModule, AtelierModule, OrsaveModule, TypeModule, TypeobjetModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
