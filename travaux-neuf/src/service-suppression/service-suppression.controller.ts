import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { deleteObject } from './interface/SuppressionInterface';
import { ServiceSuppressionService } from './service-suppression.service';

@Controller('service-suppression')
export class ServiceSuppressionController {
  constructor(private readonly serviceSuppressionService: ServiceSuppressionService) {}

  
  @Get('/sendmail')
  sendMail(){
    return this.serviceSuppressionService.sendMail();
  }

  @Delete('/deleteObjectAsAdmin/:profil')
  deleteObjectsAsAdmin(@Param('profil') profil :string, @Body() itemsRecopie: deleteObject){
    return this.serviceSuppressionService.deleteObjectsAsAdmin(profil, itemsRecopie);
  }

  @Delete('/deleteObject/:profil')
  deleteObjects(@Param('profil') profil :string, @Body() itemsRecopie: deleteObject){
    return this.serviceSuppressionService.deleteObjects(profil, itemsRecopie);
  }

}
