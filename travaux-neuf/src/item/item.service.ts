import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjetrepereService } from 'src/objetrepere/objetrepere.service';
import { TypeobjetService } from 'src/typeobjet/typeobjet.service';
import { Repository } from 'typeorm';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './entities/item.entity';

@Injectable()
export class ItemService {
  
  constructor(@InjectRepository(Item) private itemRepo : Repository<Item> , private typeObjetService : TypeobjetService, private OrService : ObjetrepereService){}
  
  async create(createItemDto: CreateItemDto) {
    const objetrepere = this.OrService.findOne(+createItemDto.idOR);
    if( objetrepere != undefined) {
      const typeObjet = this.typeObjetService.findOne(+createItemDto.codeObjet);
      if (typeObjet != undefined){
        const item = this.findOne(+createItemDto.idItem);
        if ( item == undefined){
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

  findOne(id: number) {
    return this.itemRepo.findOne({
      where : {
        idItem : id
      }
    })
  }

  async update(id: number, updateItemDto: UpdateItemDto) {
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
    await this.itemRepo.update(id, updateItemDto);
    return this.itemRepo.findOne(id);

  }

  async remove(id: number) {
    try {
      const Item = this.itemRepo.findOneOrFail({
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
    await this.itemRepo.delete(id)
    return this.itemRepo.findOne(id);
  }
}
