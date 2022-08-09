import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ServiceExportationService } from './service-exportation.service';

@Controller('service-exportation')
export class ServiceExportationController {
  constructor(private readonly serviceExportationService: ServiceExportationService) {}



  @Get()
  findAll() {
    return this.serviceExportationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceExportationService.findOne(+id);
  }

  @Get('export/getAllExportItem')
  getAllExportItem(){
    return this.serviceExportationService.getAllExportItemForGMAO();
  }



  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceExportationService.remove(+id);
  }
}
