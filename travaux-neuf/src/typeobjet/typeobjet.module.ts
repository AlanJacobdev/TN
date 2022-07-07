import { Module } from '@nestjs/common';
import { TypeobjetService } from './typeobjet.service';
import { TypeobjetController } from './typeobjet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Typeobjet } from './entities/typeobjet.entity';
import { UtilisateurModule } from 'src/utilisateur/utilisateur.module';

@Module({
  imports : [ TypeOrmModule.forFeature([Typeobjet]), UtilisateurModule],
  controllers: [TypeobjetController],
  providers: [TypeobjetService],
  exports : [TypeobjetService]
})
export class TypeobjetModule {}
