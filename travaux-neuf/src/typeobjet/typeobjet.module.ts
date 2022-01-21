import { Module } from '@nestjs/common';
import { TypeobjetService } from './typeobjet.service';
import { TypeobjetController } from './typeobjet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Typeobjet } from './entities/typeobjet.entity';

@Module({
  imports : [ TypeOrmModule.forFeature([Typeobjet])],
  controllers: [TypeobjetController],
  providers: [TypeobjetService],
  exports : [TypeobjetService]
})
export class TypeobjetModule {}
