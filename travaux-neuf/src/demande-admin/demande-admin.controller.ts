import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { DemandeAdminService } from './demande-admin.service';
import { CreateDemandeAdminDto } from './dto/create-demande-admin.dto';
import { UpdateDemandeAdminDto } from './dto/update-demande-admin.dto';


/**
 * Entité controllant l'ensemble des requêtes commençant par demande-admin (ex: localhost/demande-admin/5)
 * Permet de rediriger la requete vers la fonction dédiée
 * 
 * Plus d'informations https://docs.nestjs.com/controllers
 */

@Controller('demande-admin')
export class DemandeAdminController {
  constructor(private readonly demandeAdminService: DemandeAdminService) {}

  @Post()
  create(@Body() createDemandeAdminDto: CreateDemandeAdminDto) {
    return this.demandeAdminService.create(createDemandeAdminDto);
  }

  @Get()
  findAll() {
    return this.demandeAdminService.findAll();
  }

  @Get('/getAllObjectsFromDmd/:idDmd')
  getAllObjectsFromDmd(@Param('idDmd') idDmd: number) {
    return this.demandeAdminService.getAllObjectsFromDmd(idDmd);
  }

  @Get('getArborescenceOfOR/:idOr')
  getArborescenceOfOR(@Param('idOr') idOr: string) {
    return this.demandeAdminService.getArborescenceOfOR(idOr);
  }

  @Get('getArborescenceOfItem/:idItem')
  getArborescenceOfItem(@Param('idItem') idItem: string) {
    return this.demandeAdminService.getArborescenceOfItem(idItem);
  }

  @Delete(':id/:profil/:accept')
  remove(@Param('id') id: string, @Param('profil') profil: string, @Param('accept') accept : string ) {
    return this.demandeAdminService.remove(+id, profil, accept);
  }

  @Get('/sendmail/:user/:motif')
  sendMail(@Param('user') user: string, @Param('motif') motif: string) {
    return this.demandeAdminService.sendMail(user,motif);
  }

}
