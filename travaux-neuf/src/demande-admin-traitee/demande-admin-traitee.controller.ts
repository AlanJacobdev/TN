import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/strategy/jwt.guard';
import { DemandeAdminTraiteeService } from './demande-admin-traitee.service';
import { CreateDemandeAdminTraiteeDto } from './dto/create-demande-admin-traitee.dto';

/**
 * Entité controllant l'ensemble des requêtes commençant par demande-admin-traitee (ex: localhost/demande-admin-traitee/5)
 * Permet de rediriger la requete vers la fonction dédiée
 * 
 * Plus d'informations https://docs.nestjs.com/controllers
 */

@Controller('demande-admin-traitee')
export class DemandeAdminTraiteeController {
  constructor(private readonly demandeAdminTraiteeService: DemandeAdminTraiteeService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createDemandeAdminTraiteeDto: CreateDemandeAdminTraiteeDto) {
    return this.demandeAdminTraiteeService.create(createDemandeAdminTraiteeDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.demandeAdminTraiteeService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/getAllObjectsFromDmd/:idDmd')
  getAllObjectsFromDmd(@Param('idDmd') idDmd: number) {
    return this.demandeAdminTraiteeService.getAllObjectsFromDmd(idDmd);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getArborescenceOfOR/:idOr/:date')
  getArborescenceOfOR(@Param('idOr') idOr: string, @Param('date') date: Date) {
    return this.demandeAdminTraiteeService.getArborescenceOfOR(idOr, date);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getArborescenceOfItem/:idItem/:date')
  getArborescenceOfItem(@Param('idItem') idItem: string, @Param('date') date: Date) {
    return this.demandeAdminTraiteeService.getArborescenceOfItem(idItem, date);
  }
}
