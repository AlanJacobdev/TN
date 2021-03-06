import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DemandeAdminTraiteeService } from './demande-admin-traitee.service';
import { CreateDemandeAdminTraiteeDto } from './dto/create-demande-admin-traitee.dto';

@Controller('demande-admin-traitee')
export class DemandeAdminTraiteeController {
  constructor(private readonly demandeAdminTraiteeService: DemandeAdminTraiteeService) {}

  @Post()
  create(@Body() createDemandeAdminTraiteeDto: CreateDemandeAdminTraiteeDto) {
    return this.demandeAdminTraiteeService.create(createDemandeAdminTraiteeDto);
  }

  @Get()
  findAll() {
    return this.demandeAdminTraiteeService.findAll();
  }

  @Get('/getAllObjectsFromDmd/:idDmd')
  getAllObjectsFromDmd(@Param('idDmd') idDmd: number) {
    return this.demandeAdminTraiteeService.getAllObjectsFromDmd(idDmd);
  }

  @Get('getArborescenceOfOR/:idOr/:date')
  getArborescenceOfOR(@Param('idOr') idOr: string, @Param('date') date: Date) {
    return this.demandeAdminTraiteeService.getArborescenceOfOR(idOr, date);
  }

  @Get('getArborescenceOfItem/:idItem/:date')
  getArborescenceOfItem(@Param('idItem') idItem: string, @Param('date') date: Date) {
    return this.demandeAdminTraiteeService.getArborescenceOfItem(idItem, date);
  }
}
