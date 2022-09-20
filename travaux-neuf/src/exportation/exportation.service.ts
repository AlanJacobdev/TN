import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UtilisateurService } from 'src/utilisateur/utilisateur.service';
import { Repository } from 'typeorm';
import { CreateExportationDto } from './dto/create-exportation.dto';
import { Exportation } from './entities/exportation.entity';

/**
 * @author : @alanjacobdev
 * Classe appellée par un controleur. 
 * Manipule des données afin de les renvoyer au controleur après traitement
 */

@Injectable()
export class ExportationService {
  
  /**
   * Constructeur de la classe 
   * Injection de Repository et autres services utilisés par cette classe
   * Plus d'informations : https://docs.nestjs.com/providers
   */
  constructor(@InjectRepository(Exportation) private exportationRepo : Repository<Exportation>, private utilisateurService : UtilisateurService){}

  /**
   * Création d'une exportation 
   * @param createExportationDto : Structure attendue pour la création d'une exportation
   * @returns : L'identifiant de la nouvelle exportation
   */
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

  /**
   * Liste l'ensemble des exportations  
   * @returns L'ensemble des exportations créées
   */
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


  /**
   * Retourne une exportation
   * @param id : Identifiant de l'exportation
   * @returns Structure de l'exportation (ou undefined si introuvable)
   */
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


  /**
   * Supprime une exportation
   * @param id Identification d'une exportation
   * @returns HttpException ou une structure ({status, error} OU {status, message})
   */
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
