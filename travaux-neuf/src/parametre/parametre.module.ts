import { Module } from '@nestjs/common';
import { ParametreService } from './parametre.service';
import { ParametreController } from './parametre.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Parametre } from './entities/parametre.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Parametre])],
  controllers: [ParametreController],
  providers: [ParametreService]
})
export class ParametreModule {}
