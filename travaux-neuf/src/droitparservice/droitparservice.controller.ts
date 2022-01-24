import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { DroitparserviceService } from './droitparservice.service';
import { CreateDroitparserviceDto } from './dto/create-droitparservice.dto';
import { UpdateDroitparserviceDto } from './dto/update-droitparservice.dto';

@Controller('droitparservice')
export class DroitparserviceController {
  constructor(private readonly droitparserviceService: DroitparserviceService) {}

  @Post()
  create(@Body() createDroitparserviceDto: CreateDroitparserviceDto) {
    return this.droitparserviceService.create(createDroitparserviceDto);
  }

  @Get()
  findAll() {
    return this.droitparserviceService.findAll();
  }

  @Get(':idDroit/:idService')
  findOne(@Param('idDroit') idDroit: string, @Param('idService') idService: string) {
    return this.droitparserviceService.findOne(idDroit, idService);
  }

  @Put(':idDroit/:idService')
  update(@Param('idDroit') idDroit: string, @Param('idService') idService: string, @Body() updateDroitparserviceDto: UpdateDroitparserviceDto) {
    return this.droitparserviceService.update(idDroit, idService, updateDroitparserviceDto);
  }

  @Delete(':idDroit/:idService')
  remove(@Param('idDroit') idDroit: string, @Param('idService') idService: string) {
    return this.droitparserviceService.remove(idDroit, idService);
  }
}
