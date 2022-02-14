import { forwardRef, Module } from '@nestjs/common';
import { ItemsaveService } from './itemsave.service';
import { ItemsaveController } from './itemsave.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Itemsave } from './entities/itemsave.entity';
import { ItemModule } from 'src/item/item.module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports : [TypeOrmModule.forFeature([Itemsave]), forwardRef(() =>ItemModule)],
  controllers: [ItemsaveController],
  providers: [ItemsaveService, ConfigService],
  exports : [ItemsaveService]
})
export class ItemsaveModule {}
