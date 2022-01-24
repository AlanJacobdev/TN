import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SousitemService } from 'src/sousitem/sousitem.service';
import { Repository } from 'typeorm';
import { CreateSousitemsaveDto } from './dto/create-sousitemsave.dto';
import { UpdateSousitemsaveDto } from './dto/update-sousitemsave.dto';
import { Sousitemsave } from './entities/sousitemsave.entity';

@Injectable()
export class SousitemsaveService {

  constructor(@InjectRepository(Sousitemsave) private sousItemSaveRepo : Repository<Sousitemsave>, private sousItemService : SousitemService){}

  async create(createSousitemsaveDto: CreateSousitemsaveDto) {
    const sousItem = this.sousItemService.findOne(+createSousitemsaveDto.idSousItem);
    if (sousItem != undefined){
      const sousItemSave = this.findOne(+createSousitemsaveDto.idItem, createSousitemsaveDto.date, createSousitemsaveDto.heure);
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

  findOne(id: number, date : Date, heure : Date) {
    return this.sousItemSaveRepo.findOne({
      where : {
        idSousItem : id,
        date : date,
        heure : heure
      }
    })
  }

  findById(id: number) {
    return this.sousItemSaveRepo.find({
      where : {
        idSousItem : id
      }
    })
  }

  async remove(id: number, date: Date, heure: Date) {
    try {
      const sousitemsave = this.sousItemSaveRepo.findOneOrFail({
        where : {
          idSousItem : id,
          date : date,
          heure : heure
        }
      })
    } catch {
      throw new HttpException({
        status : HttpStatus.NOT_FOUND,
        error : 'Not Found',
      }, HttpStatus.NOT_FOUND)
    }
    await this.sousItemSaveRepo.delete(id)
    return this.findOne(id, date, heure);
  }
}
