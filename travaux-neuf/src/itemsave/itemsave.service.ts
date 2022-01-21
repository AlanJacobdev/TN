import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemService } from 'src/item/item.service';
import { Repository } from 'typeorm';
import { CreateItemsaveDto } from './dto/create-itemsave.dto';
import { UpdateItemsaveDto } from './dto/update-itemsave.dto';
import { Itemsave } from './entities/itemsave.entity';

@Injectable()
export class ItemsaveService {
  
  constructor(@InjectRepository(Itemsave) private itemSaveRepo : Repository<Itemsave> , private itemservice: ItemService){}

  async create(createItemsaveDto: CreateItemsaveDto) {
    const item = this.itemservice.findOne(+createItemsaveDto.idItem);
    if(item != undefined) {
      const itemsave  = this.findOne(+createItemsaveDto.idItem, createItemsaveDto.date, createItemsaveDto.heure);
      if ( itemsave == undefined){
        const itemsave = this.itemSaveRepo.create(createItemsaveDto);
        await this.itemSaveRepo.save(itemsave);
        return itemsave;
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

  findOne(id: number, date : Date, heure : Date) {
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
        idItem : id,
      }
    })
  }



  async update(id: number, updateItemsaveDto: UpdateItemsaveDto) {
    const itemsave = await this.itemSaveRepo.findOne({
      where : {
        idItem : id
      }
    })
    if (itemsave == undefined) {
      return {
        status : HttpStatus.NOT_FOUND,
        error : 'Identifier not found'
    }
  }
    await this.itemSaveRepo.update(id, updateItemsaveDto);
    return this.itemSaveRepo.findOne(id);
  }

  async remove(id: number) {
    try {
      const itemsave = this.itemSaveRepo.findOneOrFail({
        where : {
          idItem : id
        }
      })
    } catch {
      throw new HttpException({
        status : HttpStatus.NOT_FOUND,
        error : 'Not Found',
      }, HttpStatus.NOT_FOUND)
    }
    await this.itemSaveRepo.delete(id)
    return this.itemSaveRepo.findOne(id);
  }
}
