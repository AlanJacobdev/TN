import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemService } from 'src/item/item.service';
import { Objetrepere } from 'src/objetrepere/entities/objetrepere.entity';
import { ObjetrepereService } from 'src/objetrepere/objetrepere.service';
import { SousitemService } from 'src/sousitem/sousitem.service';
import { Repository } from 'typeorm';
import { CreateDemandeAdminDto } from './dto/create-demande-admin.dto';
import { UpdateDemandeAdminDto } from './dto/update-demande-admin.dto';
import { DemandeAdmin } from './entities/demande-admin.entity';

@Injectable()
export class DemandeAdminService {

  constructor(@InjectRepository(DemandeAdmin) private demandeAminRepo : Repository<DemandeAdmin>, private objetRepereService : ObjetrepereService, private itemService : ItemService, private sousItemService : SousitemService){}

  async create(createDemandeAdminDto: CreateDemandeAdminDto) {
    createDemandeAdminDto.dateCreation = new Date();
    createDemandeAdminDto.etat = false;

    let tabDmdOr = [];
    let tabDmdItem = [];
    let tabDmdSi = [];
    if(createDemandeAdminDto.orDelete.length != 0){
      for (const or of createDemandeAdminDto.orDelete){
        const orExist = await this.objetRepereService.findOne(or.idObjetRepere);
        if (orExist != undefined){
          tabDmdOr.push(orExist)
        }
      }
    }
    if(createDemandeAdminDto.itemDelete.length != 0){
      for (const item of createDemandeAdminDto.itemDelete){
        const itemExist = await this.itemService.findOne(item.idItem);
        if (itemExist != undefined){
          tabDmdItem.push(itemExist)
        }
      }
    }
    if(createDemandeAdminDto.sousItemDelete.length != 0){
      for (const si of createDemandeAdminDto.sousItemDelete){
        const siExist = await this.sousItemService.findOne(si.idSousItem);
        if (siExist != undefined){
          tabDmdSi.push(siExist)
        }
      }
    }

    const newDemande = this.demandeAminRepo.create(createDemandeAdminDto);
    await this.demandeAminRepo.save(newDemande);
    return newDemande;


  }

  findAll() {
    return `This action returns all demandeAdmin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} demandeAdmin`;
  }

  update(id: number, updateDemandeAdminDto: UpdateDemandeAdminDto) {
    return `This action updates a #${id} demandeAdmin`;
  }

  remove(id: number) {
    return `This action removes a #${id} demandeAdmin`;
  }
}
