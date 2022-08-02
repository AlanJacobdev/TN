import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DocumentService } from 'src/document/document.service';
import { UtilisateurService } from 'src/utilisateur/utilisateur.service';
import { Repository } from 'typeorm';
import { CreateInformationDto } from './dto/create-information.dto';
import { UpdateInformationDto } from './dto/update-information.dto';
import { Information } from './entities/information.entity';

@Injectable()
export class InformationsService {

  constructor(@InjectRepository(Information) private informationServiceRepo : Repository<Information>, private documentService : DocumentService, private utilisateurService : UtilisateurService){}

  /**
   * Création d'une information
   * @param createInformationDto : Structure attendue pour la création d'une information
   * @returns La nouvelle information ou une erreur
   */
  async create(createInformationDto: CreateInformationDto) {
        let tabDocument = [];
        if(createInformationDto.idDocument.length != 0 ) {
          for (const idDoc of createInformationDto.idDocument){
            let document = await this.documentService.findOne(idDoc);
            if (document != undefined){
              tabDocument.push(document)
            }  
          }
        }
        createInformationDto.dateCreation = new Date();
        createInformationDto.document = tabDocument;
        const newInfo = this.informationServiceRepo.create(createInformationDto);
        await this.informationServiceRepo.save(newInfo);
        return newInfo;
      
    
  }


  /**
    * Retourne l'ensemble des informations triés par ordre décroissant en fonction de leurs dates de création
   * @returns : Liste des ateliers ou [] si aucun
   */
  async findAll() {
    let res = await this.informationServiceRepo.find({
      order:{
        dateCreation : "DESC"
      },
      relations : ["document"]
    });

    for (const o of res){
      const profilCreation = await this.utilisateurService.findOneByLogin(o.profilCreation)
      if (profilCreation != undefined){
        o.profilCreation = profilCreation.nom.toUpperCase() +" "+ profilCreation.prenom;
      }
      const profilModification = await this.utilisateurService.findOneByLogin(o.profilModification)
      if (profilModification != undefined){
        o.profilModification = profilModification.nom.toUpperCase() +" "+ profilModification.prenom;
      }
    }

    return res
  }


  /**
   * Retourne l'information correspondante à l'identifiant id
   * @param id : Identifiant de l'information
   * @returns : Structure de l'information recherchée ou undefined si inconnu
   */
  findOne(id: number) {
    return this.informationServiceRepo.findOne({
      where : {
        idInfo : id
      },
      relations : ["document"]
    })
  }

  /**
   * Modifie l'information concerné en fonction des nouvelles données passée en paramètre
   * @param id : Identifiant de l'information à modifier
   * @param updateInformationDto : Données modifiés de l'objet id
   * @returns Retourne l'information modifié ou un objet {status : HttpStatus, error : string}
   */
  async update(id: number, updateInformationDto: UpdateInformationDto) {
    const info = await this.informationServiceRepo.findOne({
      where : {
        idInfo : id
      },
      relations : ["document"]
    })

    if ( info == undefined) {
      return {
        status : HttpStatus.NOT_FOUND,
        error : 'Identifiant non trouvé'
      }
    }
    
    let documentOfModification = updateInformationDto.idDocument;
    let documentOrigin : number[] = [];
    let tabDocument = [];
    info.document.forEach((x) => documentOrigin.push(x.idDoc))
     

    if(documentOrigin.length != 0 || documentOfModification.length != 0 ) {
        if(documentOrigin.length > documentOfModification.length){
          for (const doc of documentOrigin) {
            let exist = documentOfModification.find((e) => e == doc)
            if (exist == undefined) {
              let res = await this.documentService.remove(doc);
              console.log(res);
              
            }
          }
        } else {
          for (const doc of documentOrigin) {
            let exist = documentOfModification.find((e) => e == doc)
            if (exist == undefined) {
              await this.documentService.remove(doc);
            }
          
          }
        }

        for (const idDoc of documentOfModification){
          
          let document = await this.documentService.findOne(idDoc);
          
          if (document != undefined){
            tabDocument.push(document)
          }  
        
        }
    }
    
    info.dateModification = new Date();
    info.text = updateInformationDto.text;
    info.profilModification = updateInformationDto.profilModification;
    info.document = tabDocument;
    await this.informationServiceRepo.save(info);
    
    return await this.informationServiceRepo.findOne({
      where : {
        idInfo : id
      },
      relations : ["document"]
    });


  }

  /**
   * Supprime une information
   * @param id : Identifiant de l'information à supprimer
   * @returns Retourne une HttpException ou un objet {status : HttpStatus, error : string} // {status : HttpStatus, message : string}
   */
  async remove(id: number) {
    
    const info = await this.informationServiceRepo.findOne({
      where : {
        idInfo : id
      },
      relations : ["document"]
    })

    if ( info == undefined) {
      throw new HttpException({
        status : HttpStatus.NOT_FOUND,
        error : 'Item non trouvé',
      }, HttpStatus.NOT_FOUND);
    }

    try{
      for (const doc of info.document) {
        await this.documentService.remove(doc.idDoc);
      }
      
    } catch ( e :any){
      return {
        status : HttpStatus.CONFLICT,
        error : 'Problème de suppression de documents'
      }
    }
    try {
      await this.informationServiceRepo.remove(info);
    } catch ( e : any) {
      return {
        status : HttpStatus.CONFLICT,
        error :'Impossible de supprimer l\'information',
      }
    }
    
    return {
      status : HttpStatus.OK,
      message :'Information supprimée',
    }

  }
}
