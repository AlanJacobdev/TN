import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemService } from 'src/item/item.service';
import { Repository } from 'typeorm';
import { CreateItemsaveDto } from './dto/create-itemsave.dto';
import { UpdateItemsaveDto } from './dto/update-itemsave.dto';
import { Itemsave } from './entities/itemsave.entity';

@Injectable()
export class ItemsaveService {
  
  constructor(@InjectRepository(Itemsave) private itemSaveRepo : Repository<Itemsave> , @Inject(forwardRef(() => ItemService)) private itemservice: ItemService){}

  async create(createItemsaveDto: CreateItemsaveDto) {
    const item = await this.itemservice.findOne(createItemsaveDto.idItem);
    if(item != undefined) {
      const itemsave  = await this.findOne(createItemsaveDto.idItem, createItemsaveDto.date, createItemsaveDto.heure);
      if ( itemsave == undefined){
        const newitemsave = this.itemSaveRepo.create(createItemsaveDto);
        await this.itemSaveRepo.save(newitemsave);
        return newitemsave;
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
    const itemsave = await this.itemSaveRepo.findOne({
      where : {
        idItem : idItem,
        date: date.toISOString().slice(0,10),
        heure : heure.toLocaleTimeString()
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
      heure : heure.toLocaleTimeString()
    })
    return {
      status : HttpStatus.OK,
      error :'Deleted',
    }
  }
}
