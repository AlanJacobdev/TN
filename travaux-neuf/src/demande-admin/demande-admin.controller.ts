import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
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

  @Get('/get/findAllTraitee')
  findAllTraitee() {
    return this.demandeAdminService.findAllTraitee();
  }

  @Get('/getAllObjectsFromDmd/:idDmd')
  getAllObjectsFromDmd(@Param('idDmd') idDmd: number) {
    return this.demandeAdminService.getAllObjectsFromDmd(idDmd);
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.demandeAdminService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDemandeAdminDto: UpdateDemandeAdminDto) {
    return this.demandeAdminService.update(+id, updateDemandeAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.demandeAdminService.remove(+id);
  }

  @Get('/sendmail/:user/:motif')
  sendMail(@Param('user') user: string, @Param('motif') motif: string) {
    return this.demandeAdminService.sendMail(user,motif);
  }

}
