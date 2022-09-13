import { Controller, Get, Post, Body, Param, Delete, Response, HttpStatus, StreamableFile, UseGuards } from '@nestjs/common';
import { ExportationService } from './exportation.service';
import { CreateExportationDto } from './dto/create-exportation.dto';
import { createReadStream } from 'fs';
import { join } from 'path';
import { JwtAuthGuard } from 'src/auth/strategy/jwt.guard';

/**
 * Entité controllant l'ensemble des requêtes commençant par exportation (ex: localhost/exportation/5)
 * Permet de rediriger la requete vers la fonction dédiée
 * 
 * Plus d'informations https://docs.nestjs.com/controllers
 */

@Controller('exportation')
export class ExportationController {
  constructor(private readonly exportationService: ExportationService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createExportationDto: CreateExportationDto) {
    return this.exportationService.create(createExportationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.exportationService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exportationService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/readFile/:id')
  async getFile(@Response({ passthrough: true }) res, @Param('id') id: number): Promise<StreamableFile | { status: HttpStatus; error: string; }> {
    try{
      const fs = require('fs');
      let doc = await this.exportationService.findOne(id)
      
      if (fs.existsSync(doc.path)) {
        const file = createReadStream(join(process.cwd(), doc.path));
        res.set({
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="'+doc.nomDocument+'"',
        });
        return new StreamableFile(file);
      } else {
        return {
          status : HttpStatus.CONFLICT,
          error :'Document inconnu',
        }
      }
      
    } catch (e :any) {
      return {
        status : HttpStatus.CONFLICT,
        error :'Document inconnu',
      }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exportationService.remove(+id);
  }
}
