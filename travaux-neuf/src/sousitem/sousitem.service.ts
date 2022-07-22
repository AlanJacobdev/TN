import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DescriptionService } from 'src/description/description.service';
import { CreateDescriptionDto } from 'src/description/dto/create-description.dto';
import { ItemService } from 'src/item/item.service';
import { CreateSousitemsaveDto } from 'src/sousitemsave/dto/create-sousitemsave.dto';
import { SousitemsaveService } from 'src/sousitemsave/sousitemsave.service';
import { TypeobjetService } from 'src/typeobjet/typeobjet.service';
import { UtilisateurService } from 'src/utilisateur/utilisateur.service';
import { Repository } from 'typeorm';
import { CreateSousitemDto } from './dto/create-sousitem.dto';
import { UpdateSousitemDto } from './dto/update-sousitem.dto';
import { Sousitem } from './entities/sousitem.entity';

@Injectable()
export class SousitemService {
  
  
  constructor(@InjectRepository(Sousitem) private sousitemRepo:Repository<Sousitem>, private typeObjetService : TypeobjetService, private itemservice: ItemService, private sousitemSaveService : SousitemsaveService,
              private descriptionService: DescriptionService, private utilisateurService : UtilisateurService){}
  
  async create(createSousitemDto: CreateSousitemDto) {
    const item = await this.itemservice.findOne(createSousitemDto.idItem);
    if (item != undefined) {
      const typeObjet = await this.typeObjetService.findOne(createSousitemDto.codeSousItem);
      if (typeObjet != undefined){
        const idPreWithoutSec = createSousitemDto.codeSousItem + createSousitemDto.idItem;
        const SousItemPreWithoutSec = await this.findOne(idPreWithoutSec);

        const idNotPreWithoutSec = createSousitemDto.idItem + createSousitemDto.codeSousItem;
        const SousItemNotPreWithoutSec = await this.findOne(idNotPreWithoutSec);

        const idNotPreWithSec = (createSousitemDto.securite ? createSousitemDto.idItem.substring(0, createSousitemDto.idItem.length-1) : createSousitemDto.idItem)  + createSousitemDto.codeSousItem + "Z";
        const SousItemNotPreWithSec = await this.findOne(idNotPreWithSec);
        
        const idPreWithSec = createSousitemDto.codeSousItem + (createSousitemDto.securite ? createSousitemDto.idItem.substring(0, createSousitemDto.idItem.length-1) + "Z": createSousitemDto.idItem + "Z") ; 
        const SousItemPreWithSec = await this.findOne(idPreWithSec);

        if (SousItemPreWithoutSec != undefined || SousItemNotPreWithoutSec != undefined || SousItemNotPreWithSec != undefined || SousItemPreWithSec != undefined){
          return {
            status : HttpStatus.CONFLICT,
            error :'Le sous-item existe déjà ',
          }
        }
        if (createSousitemDto.securite) {
          if(createSousitemDto.estPrefixe){
            createSousitemDto.idSousItem = idPreWithSec;
          } else {
            createSousitemDto.idSousItem = idNotPreWithSec;
          }
        }else{
          if(createSousitemDto.estPrefixe){
            createSousitemDto.idSousItem = idPreWithoutSec;
          } else {
            createSousitemDto.idSousItem = idNotPreWithoutSec;
          }
        }
        let tabDescription = [];
        if( createSousitemDto.description.length != 0 ) {
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
          error :'Le type d\'objet n\'existe pas',
        }
      }
    } else {
      return {
        status : HttpStatus.NOT_FOUND,
        error :'L\'item parent n\'existe pas',
      }
    }
  }

  findAll() {
    return this.sousitemRepo.find({
      relations: ["description"],
      order : {
        idSousItem : "ASC"
      }
    });
  }

  findAllSousItemOfItem(id : string){
    return this.sousitemRepo.find({
      where : {
        idItem : id
      },
      relations: ["description"],
      order : {
        idSousItem : "ASC"
      }
    })
  }

  findAllSousItemOfItemUseful(id : string){
    return this.sousitemRepo.find({
      select : ['idSousItem', 'libelleSousItem'],
      where : {
        idItem : id
      },
      order : {
        idSousItem : "ASC"
      }
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

  async getSousItemByItemAffichage(id: string) {
    const sousItem = await this.sousitemRepo.find({
      where : {
        idItem : id
      },
      relations: ["description"],
      order: {
        idSousItem : "ASC"
      }
    })

    for (const si of sousItem){
      const profilCreation = await this.utilisateurService.findOneByLogin(si.profilCreation)
      if (profilCreation != undefined){
        si.profilCreation = profilCreation.nom.toUpperCase() +" "+ profilCreation.prenom;
      }
      const profilModification = await this.utilisateurService.findOneByLogin(si.profilModification)
      if (profilModification != undefined){
        si.profilModification = profilModification.nom.toUpperCase() +" "+ profilModification.prenom;
      }
    }


    return sousItem
  }

  async getSousItemByItem(id: string) {
    const sousItem = await this.sousitemRepo.find({
      where : {
        idItem : id
      },
      relations: ["description"],
      order: {
        idSousItem : "ASC"
      }
    })
    return sousItem
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
    if(sousitem.libelleSousItem == updateSousitemDto.libelleSousItem 
      && sousitem.etat == updateSousitemDto.etat 
      && JSON.stringify(sousitem.description) === JSON.stringify(updateSousitemDto.description)){
        throw new HttpException({
          status : HttpStatus.NOT_MODIFIED,
          error :'Aucune modification effectuée',
        }, HttpStatus.NOT_FOUND)

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

    let statusItem : string = "";
    let dateModif : Date;
    const oldItem = await this.sousitemSaveService.findOnebyIDDesc(id);
    
    if ( oldItem == undefined || oldItem.status == 'D' ) {
      statusItem = 'C'
      dateModif = sousitem.dateCreation   
    } else {
      statusItem = 'M'
      dateModif = new Date();
    }
  
    let sousitemsaveDTO = new CreateSousitemsaveDto();
    sousitemsaveDTO = {
      idSousItem : sousitem.idSousItem,
      libelleSousItem : sousitem.libelleSousItem,
      codeSousItem : sousitem.codeSousItem,
      idItem : sousitem.idItem,
      securite : sousitem.securite,
      estPrefixe : sousitem.estPrefixe,
      etat : sousitem.etat,
      date : dateModif,
      status : statusItem,
      description : sousitem.description,
      profilModification : updateSousitemDto.profilModification,
      posteModification : updateSousitemDto.posteModification

    }
       
    await this.sousitemSaveService.create(sousitemsaveDTO);
    sousitem.libelleSousItem = updateSousitemDto.libelleSousItem
    sousitem.etat  = updateSousitemDto.etat
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

  async remove(id: string, user : string, admin? : boolean, date? : Date) {
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
    
      const oldSi = await this.sousitemSaveService.findOnebyIDDesc(id);
      if ( oldSi == undefined || oldSi.status == 'D' ) {
        let SiCreateSaveDTO = new CreateSousitemsaveDto();
        SiCreateSaveDTO = {
          idSousItem : sousitem.idSousItem,
          libelleSousItem : sousitem.libelleSousItem,
          codeSousItem : sousitem.codeSousItem,
          idItem : sousitem.idItem,
          securite : sousitem.securite,
          estPrefixe : sousitem.estPrefixe,
          etat : sousitem.etat,
          date : sousitem.dateCreation,
          status : 'C',
          description : sousitem.description,
          profilModification : user,
          posteModification : ""   
        }
        
        await this.sousitemSaveService.create(SiCreateSaveDTO);
      } 

      let deleteDateSave;
      if (date){
        deleteDateSave = date
      } else {
        deleteDateSave = new Date()
      }

      let sousitemsaveDTO = new CreateSousitemsaveDto();
      sousitemsaveDTO = {
        idSousItem : sousitem.idSousItem,
        libelleSousItem : sousitem.libelleSousItem,
        codeSousItem : sousitem.codeSousItem,
        idItem : sousitem.idItem,
        securite : sousitem.securite,
        estPrefixe : sousitem.estPrefixe,
        etat : sousitem.etat,
        date : deleteDateSave,
        status : 'D',
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
    return this.sousitemSaveService.findHistoryById(idItem);
  }


  async getAllTypeAvailable(idItem : string){

    const allTypeUsed = await this.sousitemRepo.createQueryBuilder("SousItem")
    .select(['SousItem.codeSousItem as idTypeObjet'])
    .where("SousItem.idItem = :id", { id : idItem})
    .orderBy("SousItem.codeSousItem", "ASC")
    .distinct()
    .getRawMany()
    

    let alltype = await this.typeObjetService.findAllType();
    
    for (const typeUse of allTypeUsed){
      let index = alltype.findIndex((element) => element.idType === typeUse.idTypeObjet)
      if (index != -1) {
        alltype.splice(index,1);
      }
    }

    return alltype;
  }

  async getAllTypeAvailableAndActif(idItem : string){

    const allTypeUsed = await this.sousitemRepo.createQueryBuilder("SousItem")
    .select(['SousItem.codeSousItem as idTypeObjet'])
    .where("SousItem.idItem = :id", { id : idItem})
    .orderBy("SousItem.codeSousItem", "ASC")
    .distinct()
    .getRawMany()
    
    let alltype = await this.typeObjetService.findAllTypeActif();
    
    for (const typeUse of allTypeUsed){
      let index = alltype.findIndex((element) => element.idType === typeUse.idTypeObjet)
      if (index != -1) {
        alltype.splice(index,1);
      }
    }

    return alltype;
  }
  

}
