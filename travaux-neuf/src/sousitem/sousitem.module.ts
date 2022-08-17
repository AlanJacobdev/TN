import { forwardRef, Module } from '@nestjs/common';
import { SousitemService } from './sousitem.service';
import { SousitemController } from './sousitem.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sousitem } from './entities/sousitem.entity';
import { ItemModule } from 'src/item/item.module';
import { TypeobjetModule } from 'src/typeobjet/typeobjet.module';
import { SousitemsaveModule } from 'src/sousitemsave/sousitemsave.module';
import { DescriptionModule } from 'src/description/description.module';
import { UtilisateurModule } from 'src/utilisateur/utilisateur.module';
import { Item } from 'src/item/entities/item.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Sousitem, Item]), ItemModule, TypeobjetModule, forwardRef(() => SousitemsaveModule), DescriptionModule, UtilisateurModule ],
  controllers: [SousitemController],
  providers: [SousitemService],
  exports : [SousitemService]
})
export class SousitemModule {}
