import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { TypeobjetModule } from 'src/typeobjet/typeobjet.module';
import { ObjetrepereModule } from 'src/objetrepere/objetrepere.module';

@Module({
  imports : [TypeOrmModule.forFeature([Item]), TypeobjetModule, ObjetrepereModule],
  controllers: [ItemController],
  providers: [ItemService],
  exports : [ItemService]
})
export class ItemModule {}
