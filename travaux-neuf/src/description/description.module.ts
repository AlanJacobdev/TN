import { Module } from '@nestjs/common';
import { DescriptionService } from './description.service';
import { DescriptionController } from './description.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Description } from './entities/description.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Description])],
  controllers: [DescriptionController],
  providers: [DescriptionService],
  exports : [DescriptionService]
})

export class DescriptionModule {


}
