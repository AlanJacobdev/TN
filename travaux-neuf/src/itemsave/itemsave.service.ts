import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemService } from 'src/item/item.service';
import { Repository } from 'typeorm';
import { CreateItemsaveDto } from './dto/create-itemsave.dto';
import { ConfigService } from '@nestjs/config';
import { Itemsave } from './entities/itemsave.entity';

/**
 * @author : @alanjacobdev
 * Classe appellée par un controleur. 
 * Manipule des données afin de les renvoyer au controleur après traitement
 */

@Injectable()
export class ItemsaveService {
  
  constructor(@InjectRepository(Itemsave) private itemSaveRepo : Repository<Itemsave> , @Inject(forwardRef(() => ItemService)) private itemservice: ItemService, private configservice : ConfigService){}

  /**
   * Création d'un item sauvegarde 
   * @param createItemsaveDto Structure attendue pour la sauvegarde d'un item
   * @returns Le nouvel item sauvegardé ou une erreur
   */
  async create(createItemsaveDto: CreateItemsaveDto) {
    const item = await this.itemservice.findOne(createItemsaveDto.idItem);
    if(item != undefined) {
      const itemsave  = await this.findOne(createItemsaveDto.idItem, createItemsaveDto.date);
      if ( itemsave == undefined){
        try {
          const newitemsave = this.itemSaveRepo.create(createItemsaveDto);
          await this.itemSaveRepo.save(newitemsave); 
          // if(createItemsaveDto.etat === 'M') {
          //   await this.deleteSaveOlderThan(createItemsaveDto.idItem);
          // }
         
          
          return newitemsave;
        } catch (e:any) {
          throw new HttpException({
            status : HttpStatus.CONFLICT,
            error : "Problème d'insertion",
          }, HttpStatus.CONFLICT)
        }
      } else {
        return {
          status : HttpStatus.CONFLICT,
          error :'Already exist',
        }
      }
    } else {
      return {
        status : HttpStatus.CONFLICT,
        error :'L\'item source n\'existe pas',
      }
    }
  }

  /**
   * Retourne l'ensemble des items sauvegardés
   * @returns Liste des items sauvegardé ou [] si aucun
   */
  findAll() {
    return this.itemSaveRepo.find();
  }

  /**
   * Retourne l'item sauvegardé correspondant à l'identifiant id
   * @param id : Identifiant de l'item sauvegardé 
   * @param date : Date de création de la sauvegarde
   * @returns : Structure de l'item sauvegardé recherché ou undefined si inconnu
   */
  findOne(id: string, date : Date) {
    return this.itemSaveRepo.findOne({
      where : {
        idItem : id,
        date : date
      },
      relations: ["description"]
    })
  }

  /**
   * Retourne l'ensemble des items sauvegardés triés par ordre croissant en fonction de leurs identifiants et ayant comme parent @param idOr
   * @param id : Identifiant de l'objet parent
   * @param date : Date de création de la sauvegarde
   * @returns : Liste des items sauvegardés recherché ou [] si aucun 
   */
  findAllItemOfOR (id : string, date: Date) {
    return this.itemSaveRepo.find({
      where : {
        idOR : id,
        date : date
      },
      relations: ["description"],
      order : {
        idItem : "ASC"
      }
    })
  }

  /**
   * Retourne tout les items sauvegardé ayant pour identifiant @param id
   * @param id : Identifiant de l'item sauvegardé recherché
   * @returns : Liste de tout les items sauvegardés correspondant ou [] si aucun
   */

  findById(id: string) {
    return this.itemSaveRepo.find({
      where : {
        idItem : id
      },
      relations: ["description"]
    })
  }

 /**
   * Retourne tout les items sauvegardé ayant pour identifiant @param id avec ses descriptions
   * @param id : Identifiant de l'item sauvegardé recherché
   * @returns : Liste de tout les items sauvegardés correspondant ou [] si aucun
   */
  findOnebyIDDesc(id: string){
    return this.itemSaveRepo.findOne({
      where : {
        idItem : id
      },
      relations: ["description"],
      order : {
        date : "DESC"
      }
    })
  }

  /**
   * Retourne l'historique d'un item ( au maximum 5 etat) depuis sa création ou sa dernière suppression
   * @param id Identifiant d'item
   * @returns Liste d'état d'item sauvegardé
   */
  async findHistoryById(id: string) {
    let finalHistory = [];
    const history = await this.itemSaveRepo.find({
      where : {
        idItem : id
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
   * Supprime un item sauvegardé 
   * @param idItem Identifiant de l'item
   * @param date Date de la création de la sauvegarde
   * @returns Retourne une HttpException ou un objet {status : HttpStatus, error : string} // {status : HttpStatus, message : string}
   */
  async remove(idItem: string, date: Date) {
    date = new Date(date);
    const itemsave = await this.itemSaveRepo.findOne({
      where : {
        idItem : idItem,
        date: date
      }
    })
    if (itemsave == undefined) {
      throw new HttpException ({
        status : HttpStatus.NOT_FOUND,
        error : 'Not Found',
      },HttpStatus.NOT_FOUND)
    }
    await this.itemSaveRepo.delete({
      idItem,
      date : date
    })
    return {
      status : HttpStatus.OK,
      message :'Deleted',
    }
  }

  // async deleteSaveOlderThan (id : string){
  //   const existingBackUp = await this.itemSaveRepo.find({
  //     where : {
  //       idItem : id
  //     },
  //     order : {
  //       date : "ASC"
  //     }
  //   })

  //   if ( existingBackUp.length > this.configservice.get('maxSave') ){
  //     const DeletedBackUp = await this.itemSaveRepo.find({
  //       where : {
  //         idItem : id
  //       },
  //       order : {
  //         date : "ASC"
  //       },
  //       take: existingBackUp.length - this.configservice.get('maxSave'),
  //     })
  //     for (const item of DeletedBackUp){
  //       this.remove(item.idItem, item.date );
  //     }
  //   }

  // }
}
