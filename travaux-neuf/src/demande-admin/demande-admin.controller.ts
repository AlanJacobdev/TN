import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { DemandeAdminService } from './demande-admin.service';
import { CreateDemandeAdminDto } from './dto/create-demande-admin.dto';
import { UpdateDemandeAdminDto } from './dto/update-demande-admin.dto';

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

  // @Get('/get/findAllTraitee')
  // findAllTraitee() {
  //   return this.demandeAdminService.findAllTraitee();
  // }

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
  remove(@Param('id') id: string, @Param('profil') profil: string, @Param('accept') accept : boolean ) {
    return this.demandeAdminService.remove(+id, profil, accept);
  }

  @Get('/sendmail/:user/:motif')
  sendMail(@Param('user') user: string, @Param('motif') motif: string) {
    return this.demandeAdminService.sendMail(user,motif);
  }

}
