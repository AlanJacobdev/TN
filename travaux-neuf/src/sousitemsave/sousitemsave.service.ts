import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { SousitemService } from 'src/sousitem/sousitem.service';
import { Repository } from 'typeorm';
import { CreateSousitemsaveDto } from './dto/create-sousitemsave.dto';
import { Sousitemsave } from './entities/sousitemsave.entity';

/**
 * @author : @alanjacobdev
 * Classe appellée par un controleur. 
 * Manipule des données afin de les renvoyer au controleur après traitement
 */

@Injectable()
export class SousitemsaveService {

  constructor(@InjectRepository(Sousitemsave) private sousItemSaveRepo : Repository<Sousitemsave>, @Inject(forwardRef(() => SousitemService)) private sousItemService : SousitemService, private configservice : ConfigService){}

  /**
   * Création d'un sous item sauvegardé
   * @param createSousitemsaveDto : Informations utiles à la création
   * @returns Structure du nouveau sous item sauvegardé
   */
  async create(createSousitemsaveDto: CreateSousitemsaveDto) {
    const sousItem = await this.sousItemService.findOne(createSousitemsaveDto.idSousItem);
    if (sousItem != undefined){
      const sousItemSave = await this.findOne(createSousitemsaveDto.idItem, createSousitemsaveDto.date);
      if(sousItemSave == undefined) {
        try{
          const newSousItemSave = this.sousItemSaveRepo.create(createSousitemsaveDto);
          await this.sousItemSaveRepo.save(newSousItemSave)
         
          return newSousItemSave;
        } catch (e :any){
          throw new HttpException ({
            status : HttpStatus.CONFLICT,
            error : "Two insertions at same time",
          },HttpStatus.CONFLICT)
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
        error :'Sous Item doesn\'t exist',
      }
    }
  }

  /**
   * Retourne l'ensemble des sous item sauvegardé
   * @returns Liste des sous items sauvegardé existants
   */
  findAll() {
    return this.sousItemSaveRepo.find();
  }

  /**
   * Retourne un sous item sauvegardé
   * @param id : Identifiant su sous item sauvegardé
   * @param date : Date de création
   * @returns Structure du sous item sauvegardé ou undefined
   */
  findOne(id: string, date : Date) {
    return this.sousItemSaveRepo.findOne({
      where : {
        idSousItem : id,
        date : date
      },
      relations: ["description"]
    })
  }

  /**
   * Retourne l'ensemble des états d'un sous items sauvegardé
   * @param id : Identifiant d'un sous item sauvegardé
   * @returns Liste des différents états d'un sous items sauvegardé
   */
  findById(id: string) {
    return this.sousItemSaveRepo.find({
      where : {
        idSousItem : id
      },
      order : {
        date : 'DESC'
      },
      relations: ["description"]
    })
  }

  /**
   * Retourne l'identifiant et libellé de sous items sauvegardés liés à un item
   * @param id : Identifiant d'un item
   * @param date : date de création du ou des sous items
   * @returns Liste des sous-items sauvegardé liés à un item
   */
  findAllSousItemOfItemUseful(id : string, date : Date){
    return this.sousItemSaveRepo.find({
      select : ['idSousItem', 'libelleSousItem'],
      where : {
        idItem : id,
        date : date
      },
      order : {
        idSousItem : "ASC"
      }
    })
  }

  /**
   * Recherche le dernier état d'un sous item sauvegardé
   * @param id : Identifiant du sous item sauvegardé
   * @returns Structure du sous item sauvegardé
   */
  findOnebyIDDesc(id : string){
    return this.sousItemSaveRepo.findOne({
      where : {
        idSousItem : id
      },
      order : {
        date : 'DESC'
      },
      relations: ["description"]
    })
  }

  /**
   * Retourne les 5 derniers états d'un sous items sauvegardé (ou à partir de la dernière création)
   * @param id : Identifiant du sous item sauvegardé
   * @returns Liste des différents états du sous item sauvegardé
   */
  async findHistoryById(id: string) {
    let finalHistory = [];
    const history = await this.sousItemSaveRepo.find({
      where : {
        idSousItem : id
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
   * Supprime un état d'un sous items sauvegardé
   * @param idSousItem : Identifiant d'un sous item sauvegardé
   * @param date : Date de création
   * @returns Message de validation ou erreur
   */
  async remove(idSousItem: string, date: Date) {
    date = new Date(date);
 
    const sousitemsave = await this.sousItemSaveRepo.findOne({
      where : {
        idSousItem : idSousItem,
        date : date
      }
    })

    if (sousitemsave == undefined) {
      throw new HttpException({
        status : HttpStatus.NOT_FOUND,
        error : 'Not Found',
      }, HttpStatus.NOT_FOUND)
    }
    
    await this.sousItemSaveRepo.delete({
      idSousItem,
      date : date
    })
    return {
      status : HttpStatus.OK,
      error :'Deleted',
    }
  }


  
  
}
