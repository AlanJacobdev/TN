import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/strategy/jwt.guard';
import { ServiceAccueilService } from './service-accueil.service';

@Controller('service-accueil')
export class ServiceAccueilController {
  constructor(private readonly serviceAccueilService: ServiceAccueilService) {}

  @UseGuards(JwtAuthGuard)
  @Get('getNumberOfActivityForEachDay/:start/:end')
  getNumberOfActivityForEachDay(@Param('start') start: string, @Param('end') end: string) {
    return this.serviceAccueilService.getNumberOfActivityForEachDay(start, end);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getNumberOfActivityForEachDay/:start/:end/:login')
  getNumberOfMyActivityForEachDay(@Param('start') start: string, @Param('end') end: string, @Param('login') login: string) {
    return this.serviceAccueilService.getNumberOfActivityForEachDay(start, end, login );
  }

  @UseGuards(JwtAuthGuard)
  @Get('getHistoryOfOneDay/:date')
  getHistoryOfOneDay(@Param('date') date: string) {
    return this.serviceAccueilService.getHistoryOfOneDay(date);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getHistoryOfOneDay/:date/:login')
  getMyHistoryOfOneDay(@Param('date') date: string, @Param('login') login: string) {
    return this.serviceAccueilService.getHistoryOfOneDay(date,login);
  }
  
}
