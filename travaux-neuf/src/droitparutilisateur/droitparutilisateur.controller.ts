import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/strategy/jwt.guard';
import { DroitparutilisateurService } from './droitparutilisateur.service';
import { CreateDroitparutilisateurDto } from './dto/create-droitparutilisateur.dto';
import { UpdateDroitparutilisateurDto } from './dto/update-droitparutilisateur.dto';

@Controller('droitparutilisateur')
export class DroitparutilisateurController {
  constructor(private readonly droitparutilisateurService: DroitparutilisateurService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createDroitparutilisateurDto: CreateDroitparutilisateurDto) {
    return this.droitparutilisateurService.create(createDroitparutilisateurDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.droitparutilisateurService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':idDroit/:idUtilisateur')
  findOne(@Param('idDroit') idDroit: string, @Param('idUtilisateur') idUtilisateur: number) {
    return this.droitparutilisateurService.findOne(idDroit, idUtilisateur);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':idDroit/:idUtilisateur')
  update(@Param('idDroit') idDroit: string, @Param('idUtilisateur') idUtilisateur: number, @Body() updateDroitparutilisateurDto: UpdateDroitparutilisateurDto) {
    return this.droitparutilisateurService.update(idDroit, idUtilisateur, updateDroitparutilisateurDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':idDroit/:idUtilisateur')
  remove(@Param('idDroit') idDroit: string, @Param('idUtilisateur') idUtilisateur: number) {
    return this.droitparutilisateurService.remove(idDroit, idUtilisateur);
  }
}
