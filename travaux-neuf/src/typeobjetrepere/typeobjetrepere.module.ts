import { Module } from '@nestjs/common';
import { TypeobjetrepereService } from './typeobjetrepere.service';
import { TypeobjetrepereController } from './typeobjetrepere.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Typeobjetrepere } from './entities/typeobjetrepere.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Typeobjetrepere])],
  controllers: [TypeobjetrepereController],
  providers: [TypeobjetrepereService],
  exports: [TypeobjetrepereService]
})
export class TypeobjetrepereModule {}
