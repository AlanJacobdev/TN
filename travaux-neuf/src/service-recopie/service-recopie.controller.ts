import { Controller, Get, Param } from '@nestjs/common';
import { ServiceRecopieService } from './service-recopie.service';

@Controller('service-recopie')
export class ServiceRecopieController {
  constructor(private readonly serviceRecopieService: ServiceRecopieService) {}

  @Get('recopyItemFromObjetRepere/:id/:nu')
  recopyItemFromObjetRepere(@Param('id') id: string, @Param('nu') nu :string) {
    return this.serviceRecopieService.recopyItemFromObjetRepere(id,nu);
  }


  @Get('/recopySousItemFromItem/:id/:nu')
  recopySousItemFromItem(@Param('id') id :string, @Param('nu') nu : string ){
    return this.serviceRecopieService.recopySousItemFromItem(id,nu);
  }

  @Get('/recopyOneItemFromOR/:idOr/:idItem/:nu')
  recopyOneItemFromOR(@Param('idOr') idOr :string, @Param('idItem') idItem :string, @Param('nu') nu : string ){
    return this.serviceRecopieService.recopyOneItemFromOR(idOr, idItem, nu);
  }

  @Get('/recopyOneSousItemFromItem/:idItem/:idSousItem/:nu')
  recopyOneSousItemFromItem(@Param('idItem') idItem :string, @Param('idSousItem') idSousItem : string, @Param('nu') nu : string ){
    return this.serviceRecopieService.recopyOneSousItemFromItem(idItem, idSousItem, nu);
  }


}
