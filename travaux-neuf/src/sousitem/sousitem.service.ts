import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAtelierDto } from 'src/atelier/dto/create-atelier.dto';
import { DescriptionService } from 'src/description/description.service';
import { CreateDescriptionDto } from 'src/description/dto/create-description.dto';
import { Item } from 'src/item/entities/item.entity';
import { ItemService } from 'src/item/item.service';
import { CreateSousitemsaveDto } from 'src/sousitemsave/dto/create-sousitemsave.dto';
import { SousitemsaveService } from 'src/sousitemsave/sousitemsave.service';
import { Typeobjet } from 'src/typeobjet/entities/typeobjet.entity';
import { TypeobjetService } from 'src/typeobjet/typeobjet.service';
import { Repository, UpdateDateColumn } from 'typeorm';
import { CreateSousitemDto } from './dto/create-sousitem.dto';
import { UpdateSousitemDto } from './dto/update-sousitem.dto';
import { Sousitem } from './entities/sousitem.entity';

@Injectable()
export class SousitemService {
  
  
  constructor(@InjectRepository(Sousitem) private sousitemRepo:Repository<Sousitem>, private typeObjetService : TypeobjetService, private itemservice: ItemService, private sousitemSaveService : SousitemsaveService,
              private descriptionService: DescriptionService ){}
  
  async create(createSousitemDto: CreateSousitemDto) {
    const item = await this.itemservice.findOne(createSousitemDto.idItem);
    if (item != undefined) {
      const typeObjet = await this.typeObjetService.findOne(createSousitemDto.codeSousItem);
      if (typeObjet != undefined){
        const idwithoutSec = (createSousitemDto.estPrefixe) ? createSousitemDto.codeSousItem + createSousitemDto.idItem : createSousitemDto.idItem + createSousitemDto.codeSousItem  ;
        const SousItemwithoutSec = await this.findOne(idwithoutSec);
        const idwithSec = (createSousitemDto.estPrefixe) ?  createSousitemDto.codeSousItem + createSousitemDto.idItem + "Z" : createSousitemDto.idItem + createSousitemDto.codeSousItem + "Z" ;
        const SousItemwithSec = await this.findOne(idwithSec);
        if (SousItemwithoutSec != undefined || SousItemwithSec != undefined ){
          return {
            status : HttpStatus.CONFLICT,
            error :'Already exist',
          }
        }
        if (createSousitemDto.securite) {
          createSousitemDto.idSousItem = idwithSec;
        }else{
          createSousitemDto.idSousItem = idwithoutSec;
        }

        let tabDescription = [];
        
        
        if( createSousitemDto.description !== null ) {
        
          for (const desc of createSousitemDto.description){
            let newDescDTO:CreateDescriptionDto = {
              lien: desc.lien
            }
            const newDesc = await this.descriptionService.create(newDescDTO);
            let index = tabDescription.findIndex((element) => element.idDescription === newDesc.idDescription)
            if (index === -1) {
              tabDescription.push(newDesc)
            }
          }
        }
        createSousitemDto.description = tabDescription;
        createSousitemDto.dateCreation = new Date();
        const newSousItem = this.sousitemRepo.create(createSousitemDto);
        await this.sousitemRepo.save(newSousItem);
        return newSousItem;               
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
    return this.sousitemRepo.find({
      relations: ["description"]
    });
  }

  findAllSousItemOfItem(id : string){
    return this.sousitemRepo.find({
      where : {
        idItem : id
      },
      relations: ["description"]
    })
  }

  async findOne(id: string) {
    return this.sousitemRepo.findOne({
      where: {
        idSousItem:id
      },
      relations: ["description"]
    })
  }

  getSousItemByItem(id: string) {
    return this.sousitemRepo.find({
      where : {
        idItem : id
      },
      relations: ["description"]
    })
  }

  async update(id: string, updateSousitemDto: UpdateSousitemDto) {
    const sousitem = await this.sousitemRepo.findOne({
      where : {
        idSousItem : id
      },
      relations: ["description"]
    })
    if (sousitem == undefined) {
      return {
        status : HttpStatus.NOT_FOUND,
        error : 'Identifier not found'
      }
    } 

    let tabDescriptionAfter = [];

    if( updateSousitemDto.description !== null ) {
     
      for (const desc of updateSousitemDto.description){
        let newDescDTO:CreateDescriptionDto = {
          lien: desc.lien
        }
        const newDesc = await this.descriptionService.create(newDescDTO);
        let index = tabDescriptionAfter.findIndex((element) => element.idDescription === newDesc.idDescription)
        if (index === -1) {
          tabDescriptionAfter.push(newDesc)
        }
      }
    }

    let sousitemsaveDTO = new CreateSousitemsaveDto();
    sousitemsaveDTO = {
      idSousItem : sousitem.idSousItem,
      libelleSousItem : sousitem.libelleSousItem,
      codeSousItem : sousitem.codeSousItem,
      idItem : sousitem.idItem,
      securite : sousitem.securite,
      estPrefixe : sousitem.estPrefixe,
      actif : sousitem.actif,
      date : new Date(),
      etat : 'M',
      description : sousitem.description,
      profilModification : updateSousitemDto.profilModification,
      posteModification : updateSousitemDto.posteModification

    }
       
    await this.sousitemSaveService.create(sousitemsaveDTO);
    sousitem.libelleSousItem = updateSousitemDto.libelleSousItem
    sousitem.actif  = updateSousitemDto.actif
    sousitem.description  = tabDescriptionAfter;
    sousitem.profilModification  = updateSousitemDto.profilModification;
    sousitem.posteModification  = updateSousitemDto.posteModification;
    sousitem.dateModification = new Date();
    await this.sousitemRepo.save(sousitem);
    return await this.sousitemRepo.findOne({
      where : {
        idSousItem : id
      },
      relations: ["description"]
    });
  }

  async remove(id: string, user : string, admin? : boolean) {
    const sousitem = await this.sousitemRepo.findOne({
      where : {
        idSousItem : id
      }
    })
    if (sousitem == undefined) {
      throw new HttpException({
        status : HttpStatus.NOT_FOUND,
        error : 'Not Found',
      }, HttpStatus.NOT_FOUND)
    }
      if (!admin){
        if (sousitem.profilCreation !== user){
          return {
            status : HttpStatus.NOT_FOUND,
            error : 'Impossible de supprimer un objet dont vous n\'êtes pas le créateur',
          };
        }
      }
    


    let sousitemsaveDTO = new CreateSousitemsaveDto();
    sousitemsaveDTO = {
      idSousItem : sousitem.idSousItem,
      libelleSousItem : sousitem.libelleSousItem,
      codeSousItem : sousitem.codeSousItem,
      idItem : sousitem.idItem,
      securite : sousitem.securite,
      estPrefixe : sousitem.estPrefixe,
      actif : sousitem.actif,
      date : new Date(),
      etat : 'D',
      description : sousitem.description,
      profilModification : user,
      posteModification : ""

    }
    await this.sousitemSaveService.create(sousitemsaveDTO);

    try {
      await this.sousitemRepo.delete(id);
    } catch ( e : any) {
      await this.sousitemSaveService.remove(sousitemsaveDTO.idSousItem, sousitemsaveDTO.date);
      return {
        status : HttpStatus.CONFLICT,
        error :'Impossible to delete',
      }
    }
    
    return {
      status : HttpStatus.OK,
      message :'Deleted',
    }
  }

  async getHistory(idItem : string) {
    return this.sousitemSaveService.findById(idItem);
  }

}
