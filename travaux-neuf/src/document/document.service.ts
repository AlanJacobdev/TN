import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDocumentDto } from './dto/create-document.dto';
import { Document } from './entities/document.entity';

@Injectable()
export class DocumentService {
  
  constructor(@InjectRepository(Document) private documentRepo : Repository<Document>){

  }
  
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
        type: d.mimetype
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

  findAll() {
    return this.documentRepo.find();
  }

  findOne(id: number) {
    return this.documentRepo.findOne({
      where : {
        idDoc : id
      }
    })
  }

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
}
