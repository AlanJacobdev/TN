import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemService } from 'src/item/item.service';
import { Repository } from 'typeorm';
import { CreateItemsaveDto } from './dto/create-itemsave.dto';
import { ConfigService } from '@nestjs/config';
import { Itemsave } from './entities/itemsave.entity';

@Injectable()
export class ItemsaveService {
  
  constructor(@InjectRepository(Itemsave) private itemSaveRepo : Repository<Itemsave> , @Inject(forwardRef(() => ItemService)) private itemservice: ItemService, private configservice : ConfigService){}

  async create(createItemsaveDto: CreateItemsaveDto) {
    const item = await this.itemservice.findOne(createItemsaveDto.idItem);
    if(item != undefined) {
      const itemsave  = await this.findOne(createItemsaveDto.idItem, createItemsaveDto.date, createItemsaveDto.heure);
      if ( itemsave == undefined){
        try {
          const newitemsave = this.itemSaveRepo.create(createItemsaveDto);
          await this.itemSaveRepo.save(newitemsave);
          if(createItemsaveDto.etat === 'M') {
            await this.deleteSaveOlderThan(createItemsaveDto.idItem);
          }
          return newitemsave;
        } catch (e:any) {
          throw new HttpException({
            status : HttpStatus.CONFLICT,
            error : "Two insertions at same time",
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
        error :'Item doesn\'t exist',
      }
    }
  }

  findAll() {
    return this.itemSaveRepo.find();
  }

  findOne(id: string, date : Date, heure : Date) {
    return this.itemSaveRepo.findOne({
      where : {
        idItem : id,
        date : date,
        heure : heure
      }
    })
  }

  findById(id: number) {
    return this.itemSaveRepo.find({
      where : {
        idItem : id
      }
    })
  }


  async remove(idItem: string, date: Date, heure: Date) {
    date = new Date(date);
    let newHeure = new Date();
    const heureSplit = heure.toString().split(':');
    newHeure.setHours(parseInt(heureSplit[0]), parseInt(heureSplit[1]),parseInt(heureSplit[2]));
    const itemsave = await this.itemSaveRepo.findOne({
      where : {
        idItem : idItem,
        date: date.toISOString().slice(0,10),
        heure : newHeure.toLocaleTimeString()
      }
    })
    if (itemsave == undefined) {
      throw new HttpException({
        status : HttpStatus.NOT_FOUND,
        error : 'Not Found',
      }, HttpStatus.NOT_FOUND)
    }
    await this.itemSaveRepo.delete({
      idItem,
      date : date.toISOString().slice(0,10),
      heure : newHeure.toLocaleTimeString()
    })
    return {
      status : HttpStatus.OK,
      error :'Deleted',
    }
  }

  async deleteSaveOlderThan (id : string){
    const existingBackUp = await this.itemSaveRepo.find({
      where : {
        idItem : id
      },
      order : {
        date : "ASC",
        heure : "ASC"
      }
    })

    if ( existingBackUp.length > this.configservice.get('maxSave') ){
      const DeletedBackUp = await this.itemSaveRepo.find({
        where : {
          idItem : id
        },
        order : {
          date : "ASC",
          heure : "ASC"
        },
        take: 1,
      })
      this.remove(DeletedBackUp[0].idItem, DeletedBackUp[0].date ,DeletedBackUp[0].heure);
    }

  }
}
