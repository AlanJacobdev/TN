import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DescriptionService } from 'src/description/description.service';
import { CreateDescriptionDto } from 'src/description/dto/create-description.dto';
import { CreateItemsaveDto } from 'src/itemsave/dto/create-itemsave.dto';
import { ItemsaveService } from 'src/itemsave/itemsave.service';
import { UpdateObjetrepereDto } from 'src/objetrepere/dto/update-objetrepere.dto';
import { ObjetrepereService } from 'src/objetrepere/objetrepere.service';
import { TypeobjetService } from 'src/typeobjet/typeobjet.service';
import { Repository } from 'typeorm';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './entities/item.entity';


@Injectable()
export class ItemService {
  
  constructor(@InjectRepository(Item) private itemRepo : Repository<Item> , private typeObjetService : TypeobjetService, private OrService : ObjetrepereService, private itemSaveService : ItemsaveService,
              private descriptionService: DescriptionService){}
  
  async create(createItemDto: CreateItemDto) {
 
    if (createItemDto.idOR.substring(2,6) !== createItemDto.numeroUnique) {
      return {
        status : HttpStatus.NOT_FOUND,
        error :'Le numéro unique de l\'item ne correspond pas à celui de l\'objet repère',
      }
    }
    const objetrepere = await this.OrService.findOne(createItemDto.idOR);
    if( objetrepere != undefined) {
      const typeObjet = await this.typeObjetService.findOne(createItemDto.codeObjet);
      if (typeObjet != undefined){
        const idWithSec = createItemDto.codeObjet + createItemDto.numeroUnique + createItemDto.digit + "Z" ;
        const itemWithSec = await this.findOne(idWithSec)
        const idWithoutSec = createItemDto.codeObjet + createItemDto.numeroUnique + createItemDto.digit ;
        const itemWithoutSec = await this.findOne(idWithoutSec);
       
        if (itemWithSec != undefined || itemWithoutSec != undefined) {
          return {
            status : HttpStatus.CONFLICT,
            error :'Item déjà existant',
          }
        }

        if(createItemDto.securite) {
          createItemDto.idItem = idWithSec;
        }else{
          createItemDto.idItem = idWithoutSec;
        }

        let tabDescription = [];
        
        
        if( createItemDto.description !== null ) {
        
          for (const desc of createItemDto.description){
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

        createItemDto.dateCreation = new Date();
        createItemDto.description = tabDescription;
        const newItem = this.itemRepo.create(createItemDto);
        await this.itemRepo.save(newItem);
        return newItem;
      } else {
        return {
          status : HttpStatus.NOT_FOUND,
          error :'Code Objet n\'existe pas',
        }
      }
    } else {
      return {
        status : HttpStatus.NOT_FOUND,
        error :'Objet Repere n\'existe pas',
      }
    }
  }

  findAll() {
    return this.itemRepo.find({
      relations: ["description"]
    });
  }

  findOne(id: string) {
    return this.itemRepo.findOne({
      where : {
        idItem : id
      },
      relations: ["description"]
    })
  }

  findAllItemOfOR (id : string) {
    return this.itemRepo.find({
      where : {
        idOR : id
      }
    })
  }

  getItemByOR(id: string) {
    return this.itemRepo.find({
      where : {
         idOR : id
      }
    })
  }

  getItemByORAndType(id: string, type : string) {
    return this.itemRepo.find({
      where : {
         idOR : id,
         codeObjet : type
      }
    })
  }

  async update(id: string, updateItemDto: UpdateItemDto) {
    const item = await this.itemRepo.findOne({
      where : {
        idItem : id
      },
      relations : ["description"]
    })
    if (item == undefined) {
      return {
        status : HttpStatus.NOT_FOUND,
        error : 'Identifiant non trouvé'
      }
    }
 
    let tabDescriptionAfter = [];

    if( updateItemDto.description !== null ) {
     
      for (const desc of updateItemDto.description){
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
   

    let itemSaveDTO = new CreateItemsaveDto();
    itemSaveDTO = {
      idItem : item.idItem,
      libelleItem : item.libelleItem,
      idOR : item.idOR,
      codeObjet : item.codeObjet,
      numeroUnique : item.numeroUnique,
      digit : item.digit,
      securite : item.securite,
      actif : item.actif,
      etat : "M",
      description : item.description,
      date : new Date(),
      profilModification : updateItemDto.profilModification,
      posteModification : updateItemDto.posteModification
    }

    await this.itemSaveService.create(itemSaveDTO);
    item.dateModification = new Date;
    item.libelleItem = updateItemDto.libelleItem;
    item.actif = updateItemDto.actif;
    item.description = tabDescriptionAfter;
    item.profilModification = updateItemDto.profilModification;
    item.posteModification = updateItemDto.posteModification;
    await this.itemRepo.save(item);
    
    return await this.itemRepo.findOne({
      where : {
        idItem : id
      },
      relations : ["description"]
    });

  }

  async remove(id: string, user : string) {
    const item = await this.itemRepo.findOne({
      where : {
        idItem : id
      },
      relations: ["description"]
    })
    if(item == undefined) {
      throw new HttpException({
        status : HttpStatus.NOT_FOUND,
        error : 'Item non trouvé',
      }, HttpStatus.NOT_FOUND);
    }

    let itemSaveDTO = new CreateItemsaveDto();
    itemSaveDTO = {
      idItem : item.idItem,
      libelleItem : item.libelleItem,
      idOR : item.idOR,
      codeObjet : item.codeObjet,
      numeroUnique : item.numeroUnique,
      digit : item.digit,
      securite : item.securite,
      actif : item.actif,
      etat : "D",
      description : item.description,
      date : new Date(),
      profilModification : user,
      posteModification : ""
      }    
    await this.itemSaveService.create(itemSaveDTO);
    try {
      await this.itemRepo.delete(id)
    } catch ( e : any) {
      await this.itemSaveService.remove(itemSaveDTO.idItem, itemSaveDTO.date);
      return {
        status : HttpStatus.CONFLICT,
        error :'Impossible de supprimer l\'item (sous-item lié)',
      }
    }
    return {
      status : HttpStatus.OK,
      message :'Item supprimé',
    }
  }

  async getHistory(idItem : string) {
    return this.itemSaveService.findById(idItem);
  }


  async getItemFromOrAndDispo(idOr : string, type : string){
    let ItemByORAndType = await this.getItemByOR(idOr);
    let itemAndDispo= [];
    for (let i = 0 ; i<10; i++){
      itemAndDispo.push({
        "idItem" : type + idOr.substring(2,6) + i,
        "libelle" : ""
      })
    }

    for (const item of ItemByORAndType) {
      let index = itemAndDispo.findIndex((element) => element.idItem === item.idItem || element.idItem + 'Z' === item.idItem)
      itemAndDispo[index] = {
        "idItem" : item.idItem,
        "libelle" : item.libelleItem
      }
    }

    return itemAndDispo;


  }

  async getTypeOfItemsOfOR(idOR : string) {

    const res = await this.itemRepo.createQueryBuilder("Item")
    .select(['Item.codeObjet as idTypeObjet'])
    .where("Item.idOR = :id", { id : idOR})
    .distinct()
    .getRawMany()
      
    return res;

  }
}
