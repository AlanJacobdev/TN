import { Module } from '@nestjs/common';
import { InformationsService } from './informations.service';
import { InformationsController } from './informations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Information } from './entities/information.entity';
import { DocumentModule } from 'src/document/document.module';
import { UtilisateurModule } from 'src/utilisateur/utilisateur.module';

@Module({
  imports : [TypeOrmModule.forFeature([Information]), DocumentModule, UtilisateurModule],
  controllers: [InformationsController],
  providers: [InformationsService],
  exports : [InformationsService]
})
export class InformationsModule {}
