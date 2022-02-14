import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAtelierDto } from 'src/atelier/dto/create-atelier.dto';
import { Item } from 'src/item/entities/item.entity';
import { ItemService } from 'src/item/item.service';
import { CreateSousitemsaveDto } from 'src/sousitemsave/dto/create-sousitemsave.dto';
import { SousitemsaveService } from 'src/sousitemsave/sousitemsave.service';
import { Typeobjet } from 'src/typeobjet/entities/typeobjet.entity';
import { TypeobjetService } from 'src/typeobjet/typeobjet.service';
import { Repository, UpdateDateColumn } from 'typeorm';
import { CreateSousitemDto } from './dto/create-sousitem.dto';
import { UpdateSousitemDto } from './dto/update-sousitem.dto';
import { Sousitem } from './entities/sousitem.entity';

@Injectable()
export class SousitemService {
  
  constructor(@InjectRepository(Sousitem) private sousitemRepo:Repository<Sousitem>, private typeObjetService : TypeobjetService, private itemservice: ItemService, private sousitemSaveService : SousitemsaveService ){}
  
  async create(createSousitemDto: CreateSousitemDto) {
    const item = await this.itemservice.findOne(createSousitemDto.idItem);
    if (item != undefined) {
      const typeObjet = await this.typeObjetService.findOne(createSousitemDto.codeSousItem);
      if (typeObjet != undefined){
        const SousItem = await this.findOne(createSousitemDto.idSousItem);
        if(SousItem == undefined){ 
          createSousitemDto.dateCreation = new Date();
          const newSousItem = this.sousitemRepo.create(createSousitemDto);
          await this.sousitemRepo.save(newSousItem);
          return newSousItem;               
        } else {
          return {
            status : HttpStatus.CONFLICT,
            error :'Already exist',
          }
        }
      } else {
        return {
          status : HttpStatus.NOT_FOUND,
          error :'Type Objet doesn\'t exist',
        }
      }
    } else {
      return {
        status : HttpStatus.NOT_FOUND,
        error :'Item doesn\'t exist',
      }
    }
  }

  findAll() {
    return this.sousitemRepo.find();
  }

  async findOne(id: string) {
    return this.sousitemRepo.findOne({
      where: {
        idSousItem:id
      }
    })
  }

  async update(id: string, updateSousitemDto: UpdateSousitemDto) {
    const sousitem = await this.sousitemRepo.findOne({
      where : {
        idSousItem : id
      }
    })
    if (sousitem == undefined) {
      return {
        status : HttpStatus.NOT_FOUND,
        error : 'Identifier not found'
      }
    } 
    let sousitemsaveDTO = new CreateSousitemsaveDto();
    sousitemsaveDTO = {
      idSousItem : sousitem.idSousItem,
      libelleSousItem : sousitem.libelleSousItem,
      codeSousItem : sousitem.codeSousItem,
      idItem : sousitem.idItem,
      securite : sousitem.securite,
      estPrefixe : sousitem.estPrefixe,
      actif : sousitem.actif,
      date : new Date(),
      heure : new Date(),
      etat : 'M',
      description : sousitem.description,
      profilModification : updateSousitemDto.profilModification,
      posteModification : updateSousitemDto.posteModification

    }
    if (updateSousitemDto.idSousItem != id){
      return {
        status : HttpStatus.CONFLICT,
        error : 'Impossible to change ID'
      }
    }
    await this.sousitemSaveService.create(sousitemsaveDTO);
    updateSousitemDto.dateModification = new Date();
    await this.sousitemRepo.update(id, updateSousitemDto);
    return await this.sousitemRepo.findOne(id);
  }

  async remove(id: string) {
    const sousitem = await this.sousitemRepo.findOne({
      where : {
        idSousItem : id
      }
    })
    if (sousitem == undefined) {
      throw new HttpException({
        status : HttpStatus.NOT_FOUND,
        error : 'Not Found',
      }, HttpStatus.NOT_FOUND)
    }

    let sousitemsaveDTO = new CreateSousitemsaveDto();
    sousitemsaveDTO = {
      idSousItem : sousitem.idSousItem,
      libelleSousItem : sousitem.libelleSousItem,
      codeSousItem : sousitem.codeSousItem,
      idItem : sousitem.idItem,
      securite : sousitem.securite,
      estPrefixe : sousitem.estPrefixe,
      actif : sousitem.actif,
      date : new Date(),
      heure : new Date(),
      etat : 'D',
      description : sousitem.description,
      profilModification : "",
      posteModification : ""

    }
    await this.sousitemSaveService.create(sousitemsaveDTO);

    try {
      await this.sousitemRepo.delete(id);
    } catch ( e : any) {
      await this.sousitemSaveService.remove(sousitemsaveDTO.idSousItem, sousitemsaveDTO.date, sousitemsaveDTO.heure);
      return {
        status : HttpStatus.CONFLICT,
        error :'Impossible to delete',
      }
    }
    
    return {
      status : HttpStatus.OK,
      error :'Deleted',
    }
  }

  async getHistory(idItem : string) {
    return this.sousitemSaveService.findById(idItem);
  }

}
