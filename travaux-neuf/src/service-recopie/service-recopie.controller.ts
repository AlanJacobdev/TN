import { Controller, Get, Param } from '@nestjs/common';
import { ServiceRecopieService } from './service-recopie.service';

@Controller('service-recopie')
export class ServiceRecopieController {
  constructor(private readonly serviceRecopieService: ServiceRecopieService) {}

  @Get('recopyItemFromObjetRepere/:id/:nu')
  recopyItemFromObjetRepere(@Param('id') id: string, @Param('nu') nu :string) {
    return this.serviceRecopieService.recopyItemFromObjetRepere(id,nu);
  }

}
