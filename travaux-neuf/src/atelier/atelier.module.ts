import { Module } from '@nestjs/common';
import { AtelierService } from './atelier.service';
import { AtelierController } from './atelier.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Atelier } from './entities/atelier.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Atelier])],
  controllers: [AtelierController],
  providers: [AtelierService],
  exports : [AtelierService]
})
export class AtelierModule {}
