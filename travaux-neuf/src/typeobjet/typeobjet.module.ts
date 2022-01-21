import { Module } from '@nestjs/common';
import { TypeobjetService } from './typeobjet.service';
import { TypeobjetController } from './typeobjet.controller';

@Module({
  controllers: [TypeobjetController],
  providers: [TypeobjetService]
})
export class TypeobjetModule {}
