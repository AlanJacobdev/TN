import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemsaveService } from 'src/itemsave/itemsave.service';
import { OrsaveService } from 'src/orsave/orsave.service';
import { SousitemsaveService } from 'src/sousitemsave/sousitemsave.service';
import { UtilisateurService } from 'src/utilisateur/utilisateur.service';
import { Repository } from 'typeorm';
import { CreateDemandeAdminTraiteeDto } from './dto/create-demande-admin-traitee.dto';
import { DemandeAdminTraitee } from './entities/demande-admin-traitee.entity';

@Injectable()
export class DemandeAdminTraiteeService {

  constructor(@InjectRepository(DemandeAdminTraitee) private demandeAdminTraiteeRepo : Repository<DemandeAdminTraitee>, private orsaveService: OrsaveService, private itemSaveService: ItemsaveService, private sousItemSaveService : SousitemsaveService,
  private utilisateurService : UtilisateurService){}
  
  async create(createDemandeAdminTraiteeDto: CreateDemandeAdminTraiteeDto) {

    let tabDmdOr = [];
    let tabDmdItem = [];
    let tabDmdSi = [];
    if(createDemandeAdminTraiteeDto.orDelete.length != 0){
      for (const or of createDemandeAdminTraiteeDto.orDelete){
        const orExist = await this.orsaveService.findOne(or.id, or.date);
        if (orExist != undefined){
          tabDmdOr.push(orExist)
        }
      }
    }
    if(createDemandeAdminTraiteeDto.itemDelete.length != 0){
      for (const item of createDemandeAdminTraiteeDto.itemDelete){
        const itemExist = await this.itemSaveService.findOne(item.id, item.date);
        if (itemExist != undefined){
          tabDmdItem.push(itemExist)
        }   
      }
    }
    if(createDemandeAdminTraiteeDto.sousItemDelete.length != 0){
      for (const si of createDemandeAdminTraiteeDto.sousItemDelete){
        const siExist = await this.sousItemSaveService.findOne(si.id, si.date);
        if (siExist != undefined){
          tabDmdSi.push(siExist)
        }
      }
    }
    createDemandeAdminTraiteeDto.orDelete = tabDmdOr;
    createDemandeAdminTraiteeDto.itemDelete = tabDmdItem;
    createDemandeAdminTraiteeDto.sousItemDelete = tabDmdSi;

    
    const newDemande = this.demandeAdminTraiteeRepo.create(createDemandeAdminTraiteeDto);
    this.demandeAdminTraiteeRepo.save(newDemande);
    return newDemande;
    
  }

  async findAll() {
    const demandes = await this.demandeAdminTraiteeRepo.find({
      order: {
       dateModification : "DESC"
     }
    })

    for (const d of demandes) {
      const profil = await this.utilisateurService.findOneByLogin(d.profilCreation);
      d.profilCreation = (profil.nom).toUpperCase() +" "+profil.prenom
     }

    return demandes

  }

  async getAllObjectsFromDmd(idDmd : number) {
    let demande = await this.demandeAdminTraiteeRepo.findOne({
      where : {
        "idDemandeTraitee" : idDmd
      },
      join :  {
        alias : "demandeAdminTraitee",
        leftJoinAndSelect : {
          item : "demandeAdminTraitee.itemDelete",
          sousitem : "demandeAdminTraitee.sousItemDelete",
          objetrepere : "demandeAdminTraitee.orDelete"
        } 
      }
    })

    
    const profilCreation = await this.utilisateurService.findOneByLogin(demande.profilCreation);
    if (profilCreation != undefined){
      demande.profilCreation = (profilCreation.nom).toUpperCase() +" "+ profilCreation.prenom

    }

    return demande
  } 

  async getArborescenceOfOR(idObjetRepere : string, dateDel : Date) {
    
    const orExist = await this.orsaveService.findOne(idObjetRepere, dateDel);
    let allItemAndSIOfOR = [];
    if (orExist != undefined) {
      const allItemOfOR = await this.itemSaveService.findAllItemOfOR(idObjetRepere, dateDel);
      if(allItemOfOR.length != 0){
        for( const item of allItemOfOR) {
          const allSiOfItem = await this.sousItemSaveService.findAllSousItemOfItemUseful(item.idItem, dateDel);
          allItemAndSIOfOR.push({
            Item: {
              idItem: item.idItem,
              libelle: item.libelleItem
            },
            SI: allSiOfItem
          })
        }
        const ORArborescence = {
          OR: {
            idObjetRepere : orExist.idObjetRepere,
            libelleObjetRepere  : orExist.libelleObjetRepere
          },
          Item: allItemAndSIOfOR
        }
        return ORArborescence;
      }
      const ORArborescence = {
        OR: {
          idObjetRepere : orExist.idObjetRepere,
          libelleObjetRepere  : orExist.libelleObjetRepere
        },
        Item: []
      }
      return ORArborescence;
    } else {
      return {
        status : HttpStatus.NOT_FOUND,
        error : 'Objet repère inconnu'
      }
    }
  }


  async getArborescenceOfItem(idItem : string, dateDel : Date) {
    const itemExist = await this.itemSaveService.findOne(idItem, dateDel);
    if (itemExist != undefined) {
      const SiofItem= await this.sousItemSaveService.findAllSousItemOfItemUseful(idItem, dateDel);
      if (SiofItem.length != 0) {
        const allSiOfItem =
          {
            Item: {
              idItem: itemExist.idItem,
              libelle: itemExist.libelleItem
            },
            SI: SiofItem
          }
        return allSiOfItem;
      } else {
        const allSiOfItem = 
          {
            Item: {
              idItem: itemExist.idItem,
              libelle: itemExist.libelleItem
            },
            SI: []
          }
        
        return allSiOfItem;
      }
    } else {
      return {
        status : HttpStatus.NOT_FOUND,
        error : 'Item inconnu'
      }
    }
  }

}
