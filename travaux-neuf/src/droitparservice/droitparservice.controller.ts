import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/strategy/jwt.guard';
import { DroitparserviceService } from './droitparservice.service';
import { CreateDroitparserviceDto } from './dto/create-droitparservice.dto';
import { UpdateDroitparserviceDto } from './dto/update-droitparservice.dto';

@Controller('droitparservice')
export class DroitparserviceController {
  constructor(private readonly droitparserviceService: DroitparserviceService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createDroitparserviceDto: CreateDroitparserviceDto) {
    return this.droitparserviceService.create(createDroitparserviceDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.droitparserviceService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':idDroit/:idService')
  findOne(@Param('idDroit') idDroit: string, @Param('idService') idService: string) {
    return this.droitparserviceService.findOne(idDroit, idService);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':idDroit/:idService')
  update(@Param('idDroit') idDroit: string, @Param('idService') idService: string, @Body() updateDroitparserviceDto: UpdateDroitparserviceDto) {
    return this.droitparserviceService.update(idDroit, idService, updateDroitparserviceDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':idDroit/:idService')
  remove(@Param('idDroit') idDroit: string, @Param('idService') idService: string) {
    return this.droitparserviceService.remove(idDroit, idService);
  }
}
