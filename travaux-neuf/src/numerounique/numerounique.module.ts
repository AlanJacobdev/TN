import { Module } from '@nestjs/common';
import { NumerouniqueService } from './numerounique.service';
import { NumerouniqueController } from './numerounique.controller';
import { AtelierService } from 'src/atelier/atelier.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Numerounique } from './entities/numerounique.entity';
import { Atelier } from 'src/atelier/entities/atelier.entity';
import { AtelierModule } from 'src/atelier/atelier.module';

@Module({
  imports : [ TypeOrmModule.forFeature([Numerounique, Atelier]), AtelierModule],
  controllers: [NumerouniqueController],
  providers: [NumerouniqueService],
  exports : [NumerouniqueService]
})
export class NumerouniqueModule {}
