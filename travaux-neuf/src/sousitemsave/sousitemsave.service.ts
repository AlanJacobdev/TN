import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { SousitemService } from 'src/sousitem/sousitem.service';
import { Repository } from 'typeorm';
import { CreateSousitemsaveDto } from './dto/create-sousitemsave.dto';
import { Sousitemsave } from './entities/sousitemsave.entity';
import { config } from 'process';


@Injectable()
export class SousitemsaveService {

  constructor(@InjectRepository(Sousitemsave) private sousItemSaveRepo : Repository<Sousitemsave>, @Inject(forwardRef(() => SousitemService)) private sousItemService : SousitemService, private configservice : ConfigService){}

  async create(createSousitemsaveDto: CreateSousitemsaveDto) {
    const sousItem = await this.sousItemService.findOne(createSousitemsaveDto.idSousItem);
    if (sousItem != undefined){
      const sousItemSave = await this.findOne(createSousitemsaveDto.idItem, createSousitemsaveDto.date, createSousitemsaveDto.heure);
      if(sousItemSave == undefined) {
        try{
          const newSousItemSave = this.sousItemSaveRepo.create(createSousitemsaveDto);
          await this.sousItemSaveRepo.save(newSousItemSave)
          if(createSousitemsaveDto.etat === 'M') {
            await this.deleteSaveOlderThan(createSousitemsaveDto.idSousItem);
          }
          return newSousItemSave;
        } catch (e :any){
          return {
            status : HttpStatus.CONFLICT,
            error : "Two insertions at same time",
          }
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
    date = new Date(date);
    let newHeure = new Date();
    const heureSplit = heure.toString().split(':');
    newHeure.setHours(parseInt(heureSplit[0]), parseInt(heureSplit[1]),parseInt(heureSplit[2]));
    const sousitemsave = await this.sousItemSaveRepo.findOne({
      where : {
        idSousItem : idSousItem,
        date : date.toISOString().slice(0,10),
        heure : newHeure.toLocaleTimeString()
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
      heure : newHeure.toLocaleTimeString()
    })
    return {
      status : HttpStatus.OK,
      error :'Deleted',
    }
  }


  
  async deleteSaveOlderThan (id : string){
    const existingBackUp = await this.sousItemSaveRepo.find({
      where : {
        idSousItem : id
      },
      order : {
        date : "ASC",
        heure : "ASC"
      }
    })

    if ( existingBackUp.length > this.configservice.get('maxSave') ){
      const DeletedBackUp = await this.sousItemSaveRepo.find({
        where : {
          idSousItem : id
        },
        order : {
          date : "ASC",
          heure : "ASC"
        },
        take: 1,
      })
      this.remove(DeletedBackUp[0].idSousItem, DeletedBackUp[0].date ,DeletedBackUp[0].heure);
    }

  }
}
