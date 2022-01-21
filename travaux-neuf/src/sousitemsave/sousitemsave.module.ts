import { Module } from '@nestjs/common';
import { SousitemsaveService } from './sousitemsave.service';
import { SousitemsaveController } from './sousitemsave.controller';

@Module({
  controllers: [SousitemsaveController],
  providers: [SousitemsaveService]
})
export class SousitemsaveModule {}
