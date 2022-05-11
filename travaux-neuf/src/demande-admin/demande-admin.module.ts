import { Module } from '@nestjs/common';
import { DemandeAdminService } from './demande-admin.service';
import { DemandeAdminController } from './demande-admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DemandeAdmin } from './entities/demande-admin.entity';
import { ObjetrepereModule } from 'src/objetrepere/objetrepere.module';
import { ItemModule } from 'src/item/item.module';
import { SousitemModule } from 'src/sousitem/sousitem.module';

@Module({
  imports: [TypeOrmModule.forFeature([DemandeAdmin]), ObjetrepereModule, ItemModule, SousitemModule],
  controllers: [DemandeAdminController],
  providers: [DemandeAdminService],
  exports : [DemandeAdminService]
})
export class DemandeAdminModule {}
