import { Module } from '@nestjs/common';
import { ExportationService } from './exportation.service';
import { ExportationController } from './exportation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exportation } from './entities/exportation.entity';
import { UtilisateurModule } from 'src/utilisateur/utilisateur.module';

@Module({
  imports : [TypeOrmModule.forFeature([Exportation]), UtilisateurModule],
  controllers: [ExportationController],
  providers: [ExportationService],
  exports : [ExportationService]
})
export class ExportationModule {}
