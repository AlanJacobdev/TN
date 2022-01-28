import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SousitemService } from 'src/sousitem/sousitem.service';
import { Repository } from 'typeorm';
import { CreateSousitemsaveDto } from './dto/create-sousitemsave.dto';
import { Sousitemsave } from './entities/sousitemsave.entity';

@Injectable()
export class SousitemsaveService {

  constructor(@InjectRepository(Sousitemsave) private sousItemSaveRepo : Repository<Sousitemsave>, @Inject(forwardRef(() => SousitemService)) private sousItemService : SousitemService){}

  async create(createSousitemsaveDto: CreateSousitemsaveDto) {
    const sousItem = await this.sousItemService.findOne(createSousitemsaveDto.idSousItem);
    if (sousItem != undefined){
      const sousItemSave = await this.findOne(createSousitemsaveDto.idItem, createSousitemsaveDto.date, createSousitemsaveDto.heure);
      if(sousItemSave == undefined) {

        const newSousItemSave = this.sousItemSaveRepo.create(createSousitemsaveDto);
        await this.sousItemSaveRepo.save(newSousItemSave)
        return newSousItemSave;
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

  findAll() {
    return this.sousItemSaveRepo.find();
  }

  findOne(id: string, date : Date, heure : Date) {
    return this.sousItemSaveRepo.findOne({
      where : {
        idSousItem : id,
        date : date,
        heure : heure
      }
    })
  }

  findById(id: string) {
    return this.sousItemSaveRepo.find({
      where : {
        idSousItem : id
      }
    })
  }

  async remove(idSousItem: string, date: Date, heure: Date) {
    const sousitemsave = await this.sousItemSaveRepo.findOne({
      where : {
        idSousItem : idSousItem,
        date : date.toISOString().slice(0,10),
        heure : heure.toLocaleTimeString()
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
      date : date.toISOString().slice(0,10),
      heure : heure.toLocaleTimeString()
    })
    return {
      status : HttpStatus.OK,
      error :'Deleted',
    }
  }
}
