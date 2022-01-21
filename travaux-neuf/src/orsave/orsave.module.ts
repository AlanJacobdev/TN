import { Module } from '@nestjs/common';
import { OrsaveService } from './orsave.service';
import { OrsaveController } from './orsave.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orsave } from './entities/orsave.entity';
import { ObjetrepereService } from 'src/objetrepere/objetrepere.service';
import { Objetrepere } from 'src/objetrepere/entities/objetrepere.entity';
import { NumerouniqueService } from 'src/numerounique/numerounique.service';
import { ObjetrepereModule } from 'src/objetrepere/objetrepere.module';

@Module({
  imports : [TypeOrmModule.forFeature([Orsave, Objetrepere]),ObjetrepereModule],
  controllers: [OrsaveController],
  providers: [OrsaveService]
})
export class OrsaveModule {}
