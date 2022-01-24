import { Module } from '@nestjs/common';
import { DroitparserviceService } from './droitparservice.service';
import { DroitparserviceController } from './droitparservice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Droitparservice } from './entities/droitparservice.entity';
import { DroitModule } from 'src/droit/droit.module';
import { ServiceModule } from 'src/service/service.module';

@Module({
  imports : [TypeOrmModule.forFeature([Droitparservice]),DroitModule,ServiceModule],
  controllers: [DroitparserviceController],
  providers: [DroitparserviceService],
  exports : [DroitparserviceService]
})
export class DroitparserviceModule {}
