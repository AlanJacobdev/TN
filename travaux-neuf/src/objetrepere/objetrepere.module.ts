import { forwardRef, Module } from '@nestjs/common';
import { ObjetrepereService } from './objetrepere.service';
import { ObjetrepereController } from './objetrepere.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Objetrepere } from './entities/objetrepere.entity';
import { Typeobjetrepere } from 'src/typeobjetrepere/entities/typeobjetrepere.entity';
import { Numerounique } from 'src/numerounique/entities/numerounique.entity';
import { Atelier } from 'src/atelier/entities/atelier.entity';
import { NumerouniqueModule } from 'src/numerounique/numerounique.module';
import { TypeobjetrepereModule } from 'src/typeobjetrepere/typeobjetrepere.module';
import { OrsaveModule } from 'src/orsave/orsave.module';


@Module({
  imports : [TypeOrmModule.forFeature([Objetrepere, Typeobjetrepere, Numerounique, Atelier]), NumerouniqueModule, TypeobjetrepereModule, forwardRef(() =>OrsaveModule)] ,
  controllers: [ObjetrepereController],
  providers: [ObjetrepereService],
  exports : [ObjetrepereService]
})
export class ObjetrepereModule {}
