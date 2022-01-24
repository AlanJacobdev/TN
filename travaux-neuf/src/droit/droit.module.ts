import { Module } from '@nestjs/common';
import { DroitService } from './droit.service';
import { DroitController } from './droit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Droit } from './entities/droit.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Droit])],
  controllers: [DroitController],
  providers: [DroitService],
  exports :[DroitService]
})
export class DroitModule {}
