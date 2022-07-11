import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DescriptionService } from 'src/description/description.service';
import { CreateDescriptionDto } from 'src/description/dto/create-description.dto';
import { CreateItemsaveDto } from 'src/itemsave/dto/create-itemsave.dto';
import { ItemsaveService } from 'src/itemsave/itemsave.service';
import { ObjetrepereService } from 'src/objetrepere/objetrepere.service';
import { TypeobjetService } from 'src/typeobjet/typeobjet.service';
import { UtilisateurService } from 'src/utilisateur/utilisateur.service';
import { Brackets, Repository } from 'typeorm';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './entities/item.entity';


@Injectable()
export class ItemService {
  
  constructor(@InjectRepository(Item) private itemRepo : Repository<Item> , private typeObjetService : TypeobjetService, private OrService : ObjetrepereService, private itemSaveService : ItemsaveService,
              private descriptionService: DescriptionService, private utilisateurService : UtilisateurService){}
  
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
      relations: ["description"],
      order : {
        idItem : "ASC"
      }
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
      },
      relations: ["description"],
      order : {
        idItem : "ASC"
      }
    })
  }

  async getItemByORAffichage(id: string) {
    const item = await this.itemRepo.find({
      where : {
         idOR : id
      },
      relations: ["description"],
      order : {
        idItem : "ASC"
      }
    })

    for (const i of item) {
      const profilCreation = await this.utilisateurService.findOneByLogin(i.profilCreation)
      if (profilCreation != undefined){
        i.profilCreation = profilCreation.nom.toUpperCase() +" "+ profilCreation.prenom;
      }
      const profilModification = await this.utilisateurService.findOneByLogin(i.profilModification)
      if (profilModification != undefined){
        i.profilModification = profilModification.nom.toUpperCase() +" "+ profilModification.prenom;
      }
    }

    return item;
  }

  async getItemByOR(id: string) {
    const item = await this.itemRepo.find({
      where : {
         idOR : id
      },
      relations: ["description"],
      order : {
        idItem : "ASC"
      }
    })
    return item;
  }

  getItemByORAndType(id: string, type : string) {
    return this.itemRepo.find({
      where : {
         idOR : id,
         codeObjet : type
      },
      order : {
        idItem : "ASC"
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
 
    if(item.libelleItem == updateItemDto.libelleItem 
      && item.etat == updateItemDto.etat 
      && JSON.stringify(item.description) === JSON.stringify(updateItemDto.description)){
        throw new HttpException({
          status : HttpStatus.NOT_MODIFIED,
          error :'Aucune modification effectuée',
        }, HttpStatus.NOT_FOUND)

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
   
    let statusItem : string = "";
    const oldItem = await this.itemSaveService.findOnebyIDDesc(id);
    console.log(oldItem);
    
    if ( oldItem == undefined || oldItem.status == 'D' ) {
      statusItem = 'C'
    } else {
      statusItem = 'M'
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
      etat : item.etat,
      status : statusItem,
      description : item.description,
      date : new Date(),
      profilModification : updateItemDto.profilModification,
      posteModification : updateItemDto.posteModification
    }

    
    await this.itemSaveService.create(itemSaveDTO);
    item.dateModification = new Date;
    item.libelleItem = updateItemDto.libelleItem;
    item.etat = updateItemDto.etat;
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

  async remove(id: string, user : string, admin? : boolean) {
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

      if (!admin){
        if (item.profilCreation !== user){
          return {
            status : HttpStatus.NOT_FOUND,
            error : 'Impossible de supprimer un objet dont vous n\'êtes pas le créateur',
          };
        }
      }

      const oldItem = await this.itemSaveService.findOnebyIDDesc(id);
      if ( oldItem == undefined || oldItem.status == 'D' ) {
        let itemCreateSaveDTO = new CreateItemsaveDto();
        itemCreateSaveDTO = {
          idItem : item.idItem,
          libelleItem : item.libelleItem,
          idOR : item.idOR,
          codeObjet : item.codeObjet,
          numeroUnique : item.numeroUnique,
          digit : item.digit,
          securite : item.securite,
          etat : item.etat,
          status : "C",
          description : item.description,
          date : item.dateCreation,
          profilModification : user,
          posteModification : ""
        }    
        
        await this.itemSaveService.create(itemCreateSaveDTO);
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
        etat : item.etat,
        status : "D",
        description : item.description,
        date : new Date(),
        profilModification : user,
        posteModification : ""
        }    
      await this.itemSaveService.create(itemSaveDTO);
      try {
        await this.itemRepo.delete(id)
      } catch ( e : any) {
        await this.itemSaveService.remove(itemSaveDTO.idItem, item.dateCreation);
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
    return await this.itemSaveService.findHistoryById(idItem);
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


  async getItemForExport(atelier : string, typeObjet : string, objetRepere : string, dateDebut : string, dateFin : string, estActif : string, estSecurite : string){
    let date: Date;
   
    date = new Date(dateFin)
    date.setDate(date.getDate()+1)
    

    const result = this.itemRepo.createQueryBuilder("Item")
    .select(["Item.idItem, Item.libelleItem"])
    .where("1=1")
    
    if(atelier != '-1'){
      result.andWhere("Item.numeroUnique like :atelier", {atelier : `${atelier}%`})
    }
    if(typeObjet != '-1'){
      result.andWhere("Item.codeObjet = :typeObjet", {typeObjet : typeObjet.toUpperCase()})
    }
    if(objetRepere != '-1'){
      result.andWhere("Item.idOR = :objetRepere", {objetRepere : objetRepere})
    }
    if( dateDebut != '-1' && dateFin !='-1'){
      if(dateDebut == dateFin){
        result.andWhere(new Brackets(qb=>{
          qb.where("Item.dateCreation BETWEEN :start AND :end AND Item.dateModification is null", {start : dateDebut, end: date})
          qb.orWhere("Item.dateModification BETWEEN :start AND :end AND Item.dateModification is not null ", {start : dateDebut, end: date})
        }));
      
      }else{
        result.andWhere(new Brackets(qb=>{
          qb.where("Item.dateCreation BETWEEN :start AND :end AND Item.dateModification is null", {start : dateDebut, end: date})
          qb.orWhere("Item.dateModification BETWEEN :start AND :end AND Item.dateModification is not null", {start : dateDebut, end: date})
        }));
        
      }
    } else if(dateDebut != '-1'){
      result.andWhere(new Brackets(qb=>{
        qb.where("Item.dateCreation >= :startCrea AND Item.dateModification is null", {startCrea : dateDebut})
        qb.orWhere("Item.dateModification >= :startModif AND Item.dateModification is not null", {startModif : dateDebut})
      }));
      
    } else if(dateFin !='-1'){
      result.andWhere(new Brackets(qb=>{
        qb.where("Item.dateCreation <= :end AND Item.dateModification is null", { end: date})
        qb.orWhere("Item.dateModification <= :end AND Item.dateModification is not null", {end: date})
        
      })); 

    }
    if(estActif != '-1'){
      result.andWhere("Item.actif = :actif", {actif : estActif});
    }

    if(estSecurite != '-1'){
      result.andWhere("Item.securite = :securite", {securite : estSecurite});
    }
    try {
      return await result.getRawMany();
    } catch (e){
      return {
        status : HttpStatus.CONFLICT,
        error :'Format de date invalide',
      }
    }
  }


}



