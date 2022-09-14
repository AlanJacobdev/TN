import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { Document } from './entities/document.entity';

/**
 * @author : @alanjacobdev
 * Classe appellée par un controleur. 
 * Manipule des données afin de les renvoyer au controleur après traitement
 */

@Injectable()
export class DocumentService {
  
  constructor(@InjectRepository(Document) private documentRepo : Repository<Document>){
  }
  
  /**
   * Création de document
   * @param document Liste de documents créés
   * @param user Utilisateur créant les documents
   * @returns : {status : string, error : string} OU {status : string, value : string}
        
   */
  async create(document : Array<Express.Multer.File>, user : string) {
    let date = new Date();  
    let listIdDoc : number[] =[]
    

    for( const d of document) {
      
      try {
      const newDto : CreateDocumentDto = {
        idDocument: d.filename,
        nomDocument: d.originalname,
        path : d.path,
        date: date,
        profil: user,
        type: d.mimetype,
        libelleDocument : ''
      }
      
      const newDocument = this.documentRepo.create(newDto);
      await this.documentRepo.save(newDocument);
      let doc = await this.documentRepo.findOne({
        select : ["idDoc"],
        order : {
          idDoc :"DESC"
        }
      })
      listIdDoc.push(doc.idDoc)
      } catch (e:any){
        console.log("error");
        
        return {
          status : HttpStatus.CONFLICT,
          error :'Problème de création du document',
        }
      }
    }
    
    return {
      status : HttpStatus.ACCEPTED,
      value : listIdDoc
    }
  }

  /**
   * Retourne l'ensemble des document 
   * @returns : Liste des documents ou [] si aucun
   */
  findAll() {
    return this.documentRepo.find();
  }

  /**
   * Retourne un document en fonction de son identifiant
   * @param id : Identifiant du document
   * @returns : Structure du document recherché ou undefined si inconnu
   */
  findOne(id: number) {
    return this.documentRepo.findOne({
      where : {
        idDoc : id
      }
    })
  }

  /**
   * Supprime un document
   * @param id : Identifiant du document
   * @returns Retourne une HttpException ou un objet {status : HttpStatus, error : string} // {status : HttpStatus, message : string}
   */
  async remove(id: number) {
    const fs = require('fs');
    let doc = await this.documentRepo.findOne({
      where : {
        idDoc : id
      }
    })
    if(doc == undefined) {
      throw new HttpException({
        status : HttpStatus.NOT_FOUND,
        error : 'Document non trouvé',
      }, HttpStatus.NOT_FOUND);
    }

    try {
      
      fs.unlinkSync(doc.path);
      await this.documentRepo.remove(doc);
    } catch ( e : any) {
      return {
        status : HttpStatus.CONFLICT,
        error :e,
      }
    }

    return {
      status : HttpStatus.OK,
      message :'Document supprimé',
    }
  }


  /**
   * Modifie le document concerné en fonction des nouvelles données passée en paramètre
   * @param updateDocument : Données modifiés de l'objet
   * @returns Retourne le document modifié ou un objet {status : HttpStatus, error : string} // HttpsException
   */
  async update(updateDocument : UpdateDocumentDto) {
    let doc = await this.documentRepo.findOne({
      where : {
        idDoc : updateDocument.idDocument
      }
    })
    if(doc == undefined) {
      throw new HttpException({
        status : HttpStatus.NOT_FOUND,
        error : 'Document non trouvé',
      }, HttpStatus.NOT_FOUND);
    }

    try {
      
      doc.libelleDocument = updateDocument.libelleDocument;
      await this.documentRepo.save(doc);
    } catch ( e : any) {
      return {
        status : HttpStatus.CONFLICT,
        error :e,
      }
    }
    
    return await this.documentRepo.findOne({
      where : {
        idDoc : updateDocument.idDocument
      }
    });


  }
}
