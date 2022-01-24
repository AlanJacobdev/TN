import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/item/entities/item.entity';
import { ItemService } from 'src/item/item.service';
import { Typeobjet } from 'src/typeobjet/entities/typeobjet.entity';
import { TypeobjetService } from 'src/typeobjet/typeobjet.service';
import { Repository } from 'typeorm';
import { CreateSousitemDto } from './dto/create-sousitem.dto';
import { UpdateSousitemDto } from './dto/update-sousitem.dto';
import { Sousitem } from './entities/sousitem.entity';

@Injectable()
export class SousitemService {
  
  constructor(@InjectRepository(Sousitem) private sousitemRepo:Repository<Sousitem>, private typeObjetService : TypeobjetService, private itemservice: ItemService ){}
  
  async create(createSousitemDto: CreateSousitemDto) {
    const item = this.itemservice.findOne(createSousitemDto.idItem);
    if (item != undefined) {
      const typeObjet = this.typeObjetService.findOne(createSousitemDto.codeSousItem);
      if (typeObjet != undefined){
        const SousItem = this.findOne(createSousitemDto.idSousItem);
        if(SousItem == undefined){
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

  findOne(id: string) {
    this.sousitemRepo.findOne({
      where: {
        idSousItem:id
      }
    })
  }

  async update(id: string, updateSousitemDto: UpdateSousitemDto) {
    const item = await this.sousitemRepo.findOne({
      where : {
        idSousItem : id
      }
    })
    if (item == undefined) {
      return {
        status : HttpStatus.NOT_FOUND,
        error : 'Identifier not found'
      }
    } 
    await this.sousitemRepo.update(id, updateSousitemDto);
    return this.sousitemRepo.findOne(id);
  }

  async remove(id: string) {
    try {
      const sousItem = this.sousitemRepo.findOneOrFail({
        where : {
          idSousItem : id
        }
      })
    } catch {
      throw new HttpException({
        status : HttpStatus.NOT_FOUND,
        error : 'Not Found',
      }, HttpStatus.NOT_FOUND)
    }
    await this.sousitemRepo.delete(id)
    return {
      status : HttpStatus.OK,
      error :'Deleted',
    }
  }
}
