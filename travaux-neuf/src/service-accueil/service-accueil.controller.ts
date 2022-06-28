import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ServiceAccueilService } from './service-accueil.service';

@Controller('service-accueil')
export class ServiceAccueilController {
  constructor(private readonly serviceAccueilService: ServiceAccueilService) {}


  @Get('getNumberOfActivityForEachDay/:start/:end')
  getNumberOfActivityForEachDay(@Param('start') start: string, @Param('end') end: string) {
    return this.serviceAccueilService.getNumberOfActivityForEachDay(start, end);
  }

  @Get('getHistoryOfOneDay/:date')
  getHistoryOfOneDay(@Param('date') date: string) {
    return this.serviceAccueilService.getHistoryOfOneDay(date);
  }
  

  @Get()
  findAll() {
    return this.serviceAccueilService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceAccueilService.findOne(+id);
  }

  
}
