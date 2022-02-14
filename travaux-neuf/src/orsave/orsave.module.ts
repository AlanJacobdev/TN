import { forwardRef, Module } from '@nestjs/common';
import { OrsaveService } from './orsave.service';
import { OrsaveController } from './orsave.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orsave } from './entities/orsave.entity';
import { Objetrepere } from 'src/objetrepere/entities/objetrepere.entity';
import { ObjetrepereModule } from 'src/objetrepere/objetrepere.module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports : [TypeOrmModule.forFeature([Orsave, Objetrepere]), forwardRef(() =>ObjetrepereModule)],
  controllers: [OrsaveController],
  providers: [OrsaveService, ConfigService],
  exports : [OrsaveService]
})
export class OrsaveModule {}
