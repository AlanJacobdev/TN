import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ServiceSuppressionService } from './service-suppression.service';
import { CreateServiceSuppressionDto } from './dto/create-service-suppression.dto';
import { UpdateServiceSuppressionDto } from './dto/update-service-suppression.dto';

@Controller('service-suppression')
export class ServiceSuppressionController {
  constructor(private readonly serviceSuppressionService: ServiceSuppressionService) {}

  @Post()
  create(@Body() createServiceSuppressionDto: CreateServiceSuppressionDto) {
    return this.serviceSuppressionService.create(createServiceSuppressionDto);
  }

  @Get()
  findAll() {
    return this.serviceSuppressionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceSuppressionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServiceSuppressionDto: UpdateServiceSuppressionDto) {
    return this.serviceSuppressionService.update(+id, updateServiceSuppressionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceSuppressionService.remove(+id);
  }
}
