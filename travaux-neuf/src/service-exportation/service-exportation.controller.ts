import { Controller, Get, Post, Body, Response, Param, Delete, StreamableFile, UseGuards } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { doc } from 'prettier';
import { JwtAuthGuard } from 'src/auth/strategy/jwt.guard';
import { createExportGMAO, exportGMAO } from './Interface';
import { ServiceExportationService } from './service-exportation.service';

/**
 * Entité controllant l'ensemble des requêtes commençant par service-exportation (ex: localhost/service-exportation/5)
 * Permet de rediriger la requete vers la fonction dédiée
 * 
 * Plus d'informations https://docs.nestjs.com/controllers
 */

@Controller('service-exportation')
export class ServiceExportationController {
  constructor(private readonly serviceExportationService: ServiceExportationService) {}

  /**
   * Route retournant l'ensemble des objets à exporter sur la GMAO
   * @returns Liste des objets a exporter
   */
  @UseGuards(JwtAuthGuard)
  @Get('export/getAllExportItem')
  getAllExportItem(){
    return this.serviceExportationService.getAllExportItemForGMAO();
  }

  /**
   * Route recherchant l'ensemble des objet à exporter sur le GMAO pour un utilisateur donné (droits)
   * @param user : Identifiant de l'utilisateur
   * @returns Liste des objet a exporter
   */
  @UseGuards(JwtAuthGuard)
  @Get('export/getAllExportItemForGMAOForOneUser/:user')
  getAllExportItemForGMAOForOneUser(@Param('user') user: string){
    return this.serviceExportationService.getAllExportItemForGMAOForOneUser(user);
  }
  
  /**
   * Route créant un fichier excel lié à l'exportation d'objets.
   * Met à jour les status d'exportation au sein de la base
   * @param res : Retour
   * @param data : Objets a exporter
   * @returns Fichier Excel
   */
  @UseGuards(JwtAuthGuard)
  @Post('export/exportationData')
  async exportationData(@Response({ passthrough: true }) res, @Body() data: createExportGMAO){

    let resFunc: any = await this.serviceExportationService.exportationData(data);
    if(!resFunc.hasOwnProperty('error')) {
      const fs = require('fs');
      if (fs.existsSync(resFunc)) {
        const file = createReadStream(join(process.cwd(), resFunc));
        res.set({
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="'+ data.nomDocument+'"',
        });
      return new StreamableFile(file);
      }
    } else {
      return resFunc;
    }
  }

}
