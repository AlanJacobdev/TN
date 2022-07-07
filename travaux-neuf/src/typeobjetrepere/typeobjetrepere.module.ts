import { Module } from '@nestjs/common';
import { TypeobjetrepereService } from './typeobjetrepere.service';
import { TypeobjetrepereController } from './typeobjetrepere.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Typeobjetrepere } from './entities/typeobjetrepere.entity';
import { UtilisateurModule } from 'src/utilisateur/utilisateur.module';

@Module({
  imports: [TypeOrmModule.forFeature([Typeobjetrepere]), UtilisateurModule],
  controllers: [TypeobjetrepereController],
  providers: [TypeobjetrepereService],
  exports: [TypeobjetrepereService]
})
export class TypeobjetrepereModule {}
