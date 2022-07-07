import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ServiceAccueilService } from './service-accueil.service';

@Controller('service-accueil')
export class ServiceAccueilController {
  constructor(private readonly serviceAccueilService: ServiceAccueilService) {}


  @Get('getNumberOfActivityForEachDay/:start/:end')
  getNumberOfActivityForEachDay(@Param('start') start: string, @Param('end') end: string) {
    return this.serviceAccueilService.getNumberOfActivityForEachDay(start, end);
  }

  @Get('getNumberOfActivityForEachDay/:start/:end/:login')
  getNumberOfMyActivityForEachDay(@Param('start') start: string, @Param('end') end: string, @Param('login') login: string) {
    return this.serviceAccueilService.getNumberOfActivityForEachDay(start, end, login );
  }

  @Get('getHistoryOfOneDay/:date')
  getHistoryOfOneDay(@Param('date') date: string) {
    return this.serviceAccueilService.getHistoryOfOneDay(date);
  }

  @Get('getHistoryOfOneDay/:date/:login')
  getMyHistoryOfOneDay(@Param('date') date: string, @Param('login') login: string) {
    return this.serviceAccueilService.getHistoryOfOneDay(date,login);
  }
  
}
