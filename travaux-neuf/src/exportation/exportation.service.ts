import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UtilisateurService } from 'src/utilisateur/utilisateur.service';
import { Repository } from 'typeorm';
import { CreateExportationDto } from './dto/create-exportation.dto';
import { Exportation } from './entities/exportation.entity';

@Injectable()
export class ExportationService {

  constructor(@InjectRepository(Exportation) private exportationRepo : Repository<Exportation>, private utilisateurService : UtilisateurService){}

  async create(createExportationDto: CreateExportationDto) {
    const newExport = this.exportationRepo.create(createExportationDto);
      await this.exportationRepo.save(newExport);
      let doc = await this.exportationRepo.findOne({
        select : ["idExport"],
        order : {
          idExport :"DESC"
        }
      })
      return doc;
  }

  async findAll() {
    let res = await this.exportationRepo.find({
      order : {
        date : "ASC"
      }
    })

    for(const exp of res){
      const profilCreation = await this.utilisateurService.findOneByLogin(exp.profil)
      if (profilCreation != undefined){
        exp.profil = profilCreation.nom.toUpperCase() +" "+ profilCreation.prenom;
      }
    }
    return res;
  }

  async findOne(id: number) {
    let res =  await this.exportationRepo.findOne({
      where : {
        idExport : id
      }
    })

    
    const profilCreation = await this.utilisateurService.findOneByLogin(res.profil)
    if (profilCreation != undefined){
      res.profil = profilCreation.nom.toUpperCase() +" "+ profilCreation.prenom;
    }
    
    return res
  }


  async remove(id: number) {
    const fs = require('fs');
    let exp = await this.exportationRepo.findOne({
      where : {
        idDoc : id
      }
    })
    if(exp == undefined) {
      throw new HttpException({
        status : HttpStatus.NOT_FOUND,
        error : 'Document non trouvé',
      }, HttpStatus.NOT_FOUND);
    }

    try {
      
      fs.unlinkSync(exp.path);
      await this.exportationRepo.remove(exp);
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
