import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjetrepereService } from 'src/objetrepere/objetrepere.service';
import { Repository } from 'typeorm';
import { CreateOrsaveDto } from './dto/create-orsave.dto';
import { Orsave } from './entities/orsave.entity';

/**
 * @author : @alanjacobdev
 * Classe appellée par un controleur. 
 * Manipule des données afin de les renvoyer au controleur après traitement
 */

@Injectable()
export class OrsaveService {


  constructor(@InjectRepository(Orsave) private orsaveRepo : Repository<Orsave>,  @Inject(forwardRef(() => ObjetrepereService)) private orservice : ObjetrepereService){}

  /**
   * Création d'un objet repère sauvegardé
   * @param createOrsaveDto Structure attendue pour la création d'un objet repère sauvegardé
   * @returns Le nouvel objet repère sauvegardé ou une erreur 
   */
  async create(createOrsaveDto: CreateOrsaveDto) {
    const orExist = await this.orservice.findOne(createOrsaveDto.idObjetRepere);
    if ( orExist != undefined) {
      const orSave = await this.findOne(createOrsaveDto.idObjetRepere, createOrsaveDto.date);
      if ( orSave == undefined){
        try{
        const newOrSave = this.orsaveRepo.create(createOrsaveDto);
        const save = await this.orsaveRepo.save(newOrSave);
        // if(createOrsaveDto.status === 'M') {
        //   await this.deleteSaveOlderThan(createOrsaveDto.idObjetRepere);
        // }
        return save;
        } catch (e : any){
          console.log(e);
          
          throw new HttpException ({
            status : HttpStatus.CONFLICT,
            error : "Two insertions at same time",
          },HttpStatus.CONFLICT)
        }
      } else {
        return  {
          status : HttpStatus.NOT_FOUND,
          error :'Already exist'
        }
      }
    } else {
      return  {
        status : HttpStatus.NOT_FOUND,
        error :'Objet Repère doesn\'t exist'
      }
    }
  }

  /**
   * Retourne l'ensemble des objets repères sauvegardés
   * @returns Liste des objets repère sauvegardés
   */
  findAll() {
    return this.orsaveRepo.find()
  }

  /**
   * Retourne l'ensemble des sauvegardes de l'objet repère @id trié par ordre decroissant de l'identifiant
   * @param id : Identifiant de l'objet repère sauvegardé
   * @returns : Liste des objets repères sauvegardés ou [] si aucun
   */
  findById(id: string) {
    return this.orsaveRepo.find({
      where : {
        idObjetRepere : id
      },
      order : {
        date : 'DESC'
      },
      relations: ["description"]
    })
  }


  /**
   * Retourne l'ensemble des sauvegardes de l'objet repère @id avec descriptions trié par ordre decroissant de l'identifiant
   * @param id : Identifiant de l'objet repère sauvegardé
   * @returns : Liste des objets repères sauvegardés avec descriptions ou [] si aucun
   */
  findOnebyIDDesc(id: string) {
    return this.orsaveRepo.findOne({
      where : {
        idObjetRepere : id
      },
      order : {
        date : 'DESC'
      },
      relations: ["description"]
    })
  }

  /**
   * Retourne l'historique d'un objet repère ( au maximum 5 etat) depuis sa création ou sa dernière suppression
   * @param id : identifiant de l'objet repère
   * @returns Liste d'état d'objet repère sauvegardé
   */
  async findHistoryById(id: string) {
    let finalHistory = [];
    const history = await this.orsaveRepo.find({
      where : {
        idObjetRepere : id
      },
      order : {
        date : 'DESC'
      },
      take : 5,
      relations: ["description"]
    })


    const verifyIfDeleted = history.findIndex((element) => element.status == 'D')

    if ( verifyIfDeleted != -1 ){
      for (const or of history){
        if (or.status == 'D'){
          return finalHistory
        } else {
          finalHistory.push(or)
        }
      }
    } else {
      return history
    }

  }

  /**
   * Retourne un objet repère sauvegardé en fonction de son identifiant et de sa date
   * @param id : Identifiant de l'objet repère sauvegardé
   * @param date : Date de création de l'objet repère sauvegardé 
   * @returns Structure de l'objet repère sauvegardé recherché ou undefined si inconnu
   */
  findOne(id: string, date: Date){   
    date = new Date(date);
    
    return this.orsaveRepo.findOne({
      where : {
        idObjetRepere : id,
        date : date
      },
      relations: ["description"]
    })

  }

 
  /**
   * Supprime un objet repère sauvegardé 
   * @param idObjetRepere : Identifiant de l'objet repère  
   * @param date : Date de création de l'objet repère sauvegardé  
   * @returns Retourne une HttpException ou un objet {status : HttpStatus, error : string} // {status : HttpStatus, message : string}
   */
  async remove(idObjetRepere: string, date: Date) {
    
    date = new Date(date);

    const OR = await this.orsaveRepo.findOne({
      where : {
        idObjetRepere : idObjetRepere,
        date : date
      }
    })
    
    if (OR == undefined ) {
      return ({
        status : HttpStatus.NOT_FOUND,
        error :'Not Found',
      })
    }
    await this.orsaveRepo.delete({
      idObjetRepere ,
      date : date
    })
    return {
      status : HttpStatus.OK,
      error :'Deleted',
    }
  }

  // async deleteSaveOlderThan (id : string){
  //   const existingBackUp = await this.orsaveRepo.find({
  //     where : {
  //       idObjetRepere : id
  //     },
  //     order : {
  //       date : "ASC"
  //     }
  //   })

  //   if ( existingBackUp.length > this.configservice.get('maxSave') ){
  //     const DeletedBackUp = await this.orsaveRepo.find({
  //       where : {
  //         idObjetRepere : id
  //       },
  //       order : {
  //         date : "ASC"
  //       },
  //       take: existingBackUp.length - this.configservice.get('maxSave'),
  //     })
  //     for (const or of DeletedBackUp){
  //       this.remove(or.idObjetRepere, or.date );
  //     }
  //   }
   
  // }

}
