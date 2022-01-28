import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateItemsaveDto } from 'src/itemsave/dto/create-itemsave.dto';
import { ItemsaveService } from 'src/itemsave/itemsave.service';
import { ObjetrepereService } from 'src/objetrepere/objetrepere.service';
import { TypeobjetService } from 'src/typeobjet/typeobjet.service';
import { Repository } from 'typeorm';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './entities/item.entity';

@Injectable()
export class ItemService {
  
  constructor(@InjectRepository(Item) private itemRepo : Repository<Item> , private typeObjetService : TypeobjetService, private OrService : ObjetrepereService, private itemSaveService : ItemsaveService){}
  
  async create(createItemDto: CreateItemDto) {
    const objetrepere = await this.OrService.findOne(createItemDto.idOR);
    if( objetrepere != undefined) {
      const typeObjet = await this.typeObjetService.findOne(createItemDto.codeObjet);
      if (typeObjet != undefined){
        const item = await this.findOne(createItemDto.idItem);
        if ( item == undefined){
          createItemDto.dateCreation = new Date();
          const newItem = this.itemRepo.create(createItemDto);
          await this.itemRepo.save(newItem);
          return newItem;
        } else {
          return {
            status : HttpStatus.CONFLICT,
            error :'Already exist',
          }
        }
      } else {
        return {
          status : HttpStatus.NOT_FOUND,
          error :'Code Objet doesn\'t exist',
        }
      }
    } else {
      return {
        status : HttpStatus.NOT_FOUND,
        error :'Objet Repere doesn\'t exist',
      }
    }
  }

  findAll() {
    return this.itemRepo.find();
  }

  findOne(id: string) {
    return this.itemRepo.findOne({
      where : {
        idItem : id
      }
    })
  }

  async update(id: string, updateItemDto: UpdateItemDto) {
    const item = await this.itemRepo.findOne({
      where : {
        idItem : id
      }
    })
    if (item == undefined) {
      return {
        status : HttpStatus.NOT_FOUND,
        error : 'Identifier not found'
      }
    }
    let itemSaveDTO = new CreateItemsaveDto();
    itemSaveDTO = {
      idItem : item.idItem,
      libelleItem : item.libelleItem,
      idOR : item.idOR,
      codeObjet : item.codeObjet,
      numeroUnique : item.numeroUnique,
      digit : item.digit,
      securite : item.securite,
      actif : item.actif,
      etat : "M",
      description : item.description,
      heure : new Date(),
      date : new Date(),
      profilModification : updateItemDto.profilModification,
      posteModification : updateItemDto.posteModification
  }

    
    await this.itemSaveService.create(itemSaveDTO);
    updateItemDto.dateModification = new Date;
    await this.itemRepo.update(id, updateItemDto);
    return await this.itemRepo.findOne(id);

  }

  async remove(id: string) {
    const item = await this.itemRepo.findOne({
      where : {
        idItem : id
      }
    })
    if(item == undefined) {
      throw new HttpException({
        status : HttpStatus.NOT_FOUND,
        error : 'Not Found',
      }, HttpStatus.NOT_FOUND);
    }

    let itemSaveDTO = new CreateItemsaveDto();
    itemSaveDTO = {
      idItem : item.idItem,
      libelleItem : item.libelleItem,
      idOR : item.idOR,
      codeObjet : item.codeObjet,
      numeroUnique : item.numeroUnique,
      digit : item.digit,
      securite : item.securite,
      actif : item.actif,
      etat : "D",
      description : item.description,
      heure : new Date(),
      date : new Date(),
      profilModification : "",
      posteModification : ""
      }    
    this.itemSaveService.create(itemSaveDTO);
    try {
      await this.itemRepo.delete(id)
    } catch ( e : any) {
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
}
