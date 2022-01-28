import { forwardRef, Module } from '@nestjs/common';
import { ItemsaveService } from './itemsave.service';
import { ItemsaveController } from './itemsave.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Itemsave } from './entities/itemsave.entity';
import { ItemModule } from 'src/item/item.module';

@Module({
  imports : [TypeOrmModule.forFeature([Itemsave]), forwardRef(() =>ItemModule)],
  controllers: [ItemsaveController],
  providers: [ItemsaveService],
  exports : [ItemsaveService]
})
export class ItemsaveModule {}
