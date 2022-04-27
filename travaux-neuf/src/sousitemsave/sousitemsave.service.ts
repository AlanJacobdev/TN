import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { SousitemService } from 'src/sousitem/sousitem.service';
import { Repository } from 'typeorm';
import { CreateSousitemsaveDto } from './dto/create-sousitemsave.dto';
import { Sousitemsave } from './entities/sousitemsave.entity';


@Injectable()
export class SousitemsaveService {

  constructor(@InjectRepository(Sousitemsave) private sousItemSaveRepo : Repository<Sousitemsave>, @Inject(forwardRef(() => SousitemService)) private sousItemService : SousitemService, private configservice : ConfigService){}

  async create(createSousitemsaveDto: CreateSousitemsaveDto) {
    const sousItem = await this.sousItemService.findOne(createSousitemsaveDto.idSousItem);
    if (sousItem != undefined){
      const sousItemSave = await this.findOne(createSousitemsaveDto.idItem, createSousitemsaveDto.date);
      if(sousItemSave == undefined) {
        try{
          const newSousItemSave = this.sousItemSaveRepo.create(createSousitemsaveDto);
          await this.sousItemSaveRepo.save(newSousItemSave)
          if(createSousitemsaveDto.etat === 'M') {
            await this.deleteSaveOlderThan(createSousitemsaveDto.idSousItem);
          }
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

  findAll() {
    return this.sousItemSaveRepo.find();
  }

  findOne(id: string, date : Date) {
    return this.sousItemSaveRepo.findOne({
      where : {
        idSousItem : id,
        date : date
      },
      relations: ["description"]
    })
  }

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


  
  async deleteSaveOlderThan (id : string){
    const existingBackUp = await this.sousItemSaveRepo.find({
      where : {
        idSousItem : id
      },
      order : {
        date : "ASC"
      }
    })

    if ( existingBackUp.length > this.configservice.get('maxSave') ){
      const DeletedBackUp = await this.sousItemSaveRepo.find({
        where : {
          idSousItem : id
        },
        order : {
          date : "ASC"
        },
        take: existingBackUp.length - this.configservice.get('maxSave') ,
      })
      for (const sousItem of DeletedBackUp){
        this.remove(sousItem.idSousItem, sousItem.date );
      }
    }

  }
}
