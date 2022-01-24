import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { DroitparutilisateurService } from './droitparutilisateur.service';
import { CreateDroitparutilisateurDto } from './dto/create-droitparutilisateur.dto';
import { UpdateDroitparutilisateurDto } from './dto/update-droitparutilisateur.dto';

@Controller('droitparutilisateur')
export class DroitparutilisateurController {
  constructor(private readonly droitparutilisateurService: DroitparutilisateurService) {}

  @Post()
  create(@Body() createDroitparutilisateurDto: CreateDroitparutilisateurDto) {
    return this.droitparutilisateurService.create(createDroitparutilisateurDto);
  }

  @Get()
  findAll() {
    return this.droitparutilisateurService.findAll();
  }

  @Get(':idDroit/:idUtilisateur')
  findOne(@Param('idDroit') idDroit: string, @Param('idUtilisateur') idUtilisateur: number) {
    return this.droitparutilisateurService.findOne(idDroit, idUtilisateur);
  }

  @Put(':idDroit/:idUtilisateur')
  update(@Param('idDroit') idDroit: string, @Param('idUtilisateur') idUtilisateur: number, @Body() updateDroitparutilisateurDto: UpdateDroitparutilisateurDto) {
    return this.droitparutilisateurService.update(idDroit, idUtilisateur, updateDroitparutilisateurDto);
  }

  @Delete(':idDroit/:idUtilisateur')
  remove(@Param('idDroit') idDroit: string, @Param('idUtilisateur') idUtilisateur: number) {
    return this.droitparutilisateurService.remove(idDroit, idUtilisateur);
  }
}
