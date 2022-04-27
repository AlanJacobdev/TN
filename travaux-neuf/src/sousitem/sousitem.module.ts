import { forwardRef, Module } from '@nestjs/common';
import { SousitemService } from './sousitem.service';
import { SousitemController } from './sousitem.controller';
import { SousitemsaveService } from 'src/sousitemsave/sousitemsave.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sousitem } from './entities/sousitem.entity';
import { ItemService } from 'src/item/item.service';
import { ItemModule } from 'src/item/item.module';
import { TypeobjetModule } from 'src/typeobjet/typeobjet.module';
import { SousitemsaveModule } from 'src/sousitemsave/sousitemsave.module';
import { DescriptionModule } from 'src/description/description.module';

@Module({
  imports : [TypeOrmModule.forFeature([Sousitem]), ItemModule, TypeobjetModule, forwardRef(() => SousitemsaveModule), DescriptionModule ],
  controllers: [SousitemController],
  providers: [SousitemService],
  exports : [SousitemService]
})
export class SousitemModule {}
