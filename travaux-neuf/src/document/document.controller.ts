import { Controller, Get, Post,Response, Param, Delete, UploadedFiles, UseInterceptors, StreamableFile, HttpStatus, Put, Body, Req } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';
import { diskStorage } from 'multer';
import { join } from 'path';
import { DocumentService } from './document.service';
import { UpdateDocumentDto } from './dto/update-document.dto';

/**
 * Entité controllant l'ensemble des requêtes commençant par document (ex: localhost/document/5)
 * Permet de rediriger la requete vers la fonction dédiée
 * 
 * Plus d'informations https://docs.nestjs.com/controllers
 */

@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  /**
   * Route permettant l'importation de documents liés a une information
   * @param file : Fichier envoyé
   * @param user : Utilisateur à l'origine de l'importation
   * @returns : {status : string, error : string} OU {status : string, value : string}
   */
  @Post('file-upload/:user')
  @UseInterceptors(FilesInterceptor('document', 20, {
    storage: diskStorage({
      destination: './../document'
    })
  }))
  async createDocument(@UploadedFiles() file: Array<Express.Multer.File>, @Param('user') user :string) {
    return this.documentService.create(file, user)
  }
  
  /**
   * Route retournant l'ensemble des documents 
   * @returns Liste des documents existants
   */
  @Get()
  findAll() {
    return this.documentService.findAll();
  }

  /**
   * Route retournant un documents dont l'identifiant correspond à celui passé en paramètre
   * @param id : Identifiant du document
   * @returns Structure du document recherché
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentService.findOne(+id);
  }

  /**
   * Route permettant la lecture d'un document
   * @param res : Retour (fichier)
   * @param id : Identifiant du document
   * @returns Fichier ou erreur
   */
  @Get('/readFile/:id')
  async getFile(@Response({ passthrough: true }) res, @Param('id') id: number): Promise<StreamableFile | { status: HttpStatus; error: string; }> {
    try{
      const fs = require('fs');
      let doc = await this.documentService.findOne(id)
      
      if (fs.existsSync(doc.path)) {
        const file = createReadStream(join(process.cwd(), doc.path));
        res.set({
          'Content-Type': doc.type,
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
  

  /**
   * Route mettant à jour un document
   * @param updateInformationDto : Structure contenant les champs modifiés
   * @returns Structure du document modifié
   */
  @Put()
  update(@Body() updateInformationDto: UpdateDocumentDto) {
    return this.documentService.update(updateInformationDto);
  }
  
  /**
   * Route supprimant un document
   * @param id : Identifiant du document
   * @returns Message de validation ou erreur
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentService.remove(+id);
  }
}
