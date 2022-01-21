import { Module } from '@nestjs/common';
import { SousitemService } from './sousitem.service';
import { SousitemController } from './sousitem.controller';
import { SousitemsaveService } from 'src/sousitemsave/sousitemsave.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sousitem } from './entities/sousitem.entity';
import { ItemService } from 'src/item/item.service';
import { ItemModule } from 'src/item/item.module';
import { TypeobjetModule } from 'src/typeobjet/typeobjet.module';

@Module({
  imports : [TypeOrmModule.forFeature([Sousitem]), ItemModule, TypeobjetModule],
  controllers: [SousitemController],
  providers: [SousitemService],
  exports : [SousitemService]
})
export class SousitemModule {}
