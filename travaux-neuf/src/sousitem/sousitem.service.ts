import { Injectable } from '@nestjs/common';
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
  
  create(createSousitemDto: CreateSousitemDto) {
    return 'This action adds a new sousitem';
  }

  findAll() {
    return this.sousitemRepo.find();
  }

  findOne(id: number) {
    this.sousitemRepo.findOne({
      where: {
        idSousItem:id
      }
    })
  }

  update(id: number, updateSousitemDto: UpdateSousitemDto) {
    return `This action updates a #${id} sousitem`;
  }

  remove(id: number) {
    return `This action removes a #${id} sousitem`;
  }
}
