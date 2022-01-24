import { Module } from '@nestjs/common';
import { SousitemsaveService } from './sousitemsave.service';
import { SousitemsaveController } from './sousitemsave.controller';
import { SousitemService } from 'src/sousitem/sousitem.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sousitemsave } from './entities/sousitemsave.entity';
import { Sousitem } from 'src/sousitem/entities/sousitem.entity';
import { SousitemModule } from 'src/sousitem/sousitem.module';

@Module({
  imports : [TypeOrmModule.forFeature([Sousitemsave, Sousitem]), SousitemModule],
  controllers: [SousitemsaveController],
  providers: [SousitemsaveService],
  exports : [SousitemsaveService]
})
export class SousitemsaveModule {}
