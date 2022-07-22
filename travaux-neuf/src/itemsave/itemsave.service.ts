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
      const itemsave  = await this.findOne(createItemsaveDto.idItem, createItemsaveDto.date);
      if ( itemsave == undefined){
        try {
          const newitemsave = this.itemSaveRepo.create(createItemsaveDto);
          await this.itemSaveRepo.save(newitemsave); 
          // if(createItemsaveDto.etat === 'M') {
          //   await this.deleteSaveOlderThan(createItemsaveDto.idItem);
          // }
         
          
          return newitemsave;
        } catch (e:any) {
          throw new HttpException({
            status : HttpStatus.CONFLICT,
            error : "Problème d'insertion",
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
        error :'L\'item source n\'existe pas',
      }
    }
  }

  findAll() {
    return this.itemSaveRepo.find();
  }

  findOne(id: string, date : Date) {
    return this.itemSaveRepo.findOne({
      where : {
        idItem : id,
        date : date
      },
      relations: ["description"]
    })
  }

  findAllItemOfOR (id : string, date: Date) {
    return this.itemSaveRepo.find({
      where : {
        idOR : id,
        date : date
      },
      relations: ["description"],
      order : {
        idItem : "ASC"
      }
    })
  }

  findById(id: string) {
    return this.itemSaveRepo.find({
      where : {
        idItem : id
      },
      relations: ["description"]
    })
  }

  findOnebyIDDesc(id: string){
    return this.itemSaveRepo.findOne({
      where : {
        idItem : id
      },
      relations: ["description"],
      order : {
        date : "DESC"
      }
    })
  }

  async findHistoryById(id: string) {
    let finalHistory = [];
    const history = await this.itemSaveRepo.find({
      where : {
        idItem : id
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



  async remove(idItem: string, date: Date) {
    date = new Date(date);
    const itemsave = await this.itemSaveRepo.findOne({
      where : {
        idItem : idItem,
        date: date
      }
    })
    if (itemsave == undefined) {
      throw new HttpException ({
        status : HttpStatus.NOT_FOUND,
        error : 'Not Found',
      },HttpStatus.NOT_FOUND)
    }
    await this.itemSaveRepo.delete({
      idItem,
      date : date
    })
    return {
      status : HttpStatus.OK,
      error :'Deleted',
    }
  }

  // async deleteSaveOlderThan (id : string){
  //   const existingBackUp = await this.itemSaveRepo.find({
  //     where : {
  //       idItem : id
  //     },
  //     order : {
  //       date : "ASC"
  //     }
  //   })

  //   if ( existingBackUp.length > this.configservice.get('maxSave') ){
  //     const DeletedBackUp = await this.itemSaveRepo.find({
  //       where : {
  //         idItem : id
  //       },
  //       order : {
  //         date : "ASC"
  //       },
  //       take: existingBackUp.length - this.configservice.get('maxSave'),
  //     })
  //     for (const item of DeletedBackUp){
  //       this.remove(item.idItem, item.date );
  //     }
  //   }

  // }
}
