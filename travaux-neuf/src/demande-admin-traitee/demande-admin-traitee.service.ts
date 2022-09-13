import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemsaveService } from 'src/itemsave/itemsave.service';
import { OrsaveService } from 'src/orsave/orsave.service';
import { SousitemsaveService } from 'src/sousitemsave/sousitemsave.service';
import { UtilisateurService } from 'src/utilisateur/utilisateur.service';
import { Repository } from 'typeorm';
import { CreateDemandeAdminTraiteeDto } from './dto/create-demande-admin-traitee.dto';
import { DemandeAdminTraitee } from './entities/demande-admin-traitee.entity';


/**
 * @author : @alanjacobdev
 * Classe appellée par un controleur. 
 * Manipule des données afin de les renvoyer au controleur après traitement
 */

@Injectable()
export class DemandeAdminTraiteeService {

  constructor(@InjectRepository(DemandeAdminTraitee) private demandeAdminTraiteeRepo : Repository<DemandeAdminTraitee>, private orsaveService: OrsaveService, private itemSaveService: ItemsaveService, private sousItemSaveService : SousitemsaveService,
  private utilisateurService : UtilisateurService){}
  

  /**
   * Creation d'une demande de suppression traitée
   * @param createDemandeAdminTraiteeDto : Structure attendue pour la création d'une demande de suppression traitée
   * @returns : La nouvelle demande de suppression traitée ou une erreur
   */
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

  /**
   * Retourne l'ensemble des demandes de suppression traitées par ordre de modification decroissant
   * @returns Liste de l'ensemble des demandes de suppression traitées ou [] si aucune demande
   */
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

  /**
   * Retourne l'ensemble des objets (OR, Item, SI) lié à une demande de suppression traitée avec le nom du demandeur en format Nom prénom
   * @param idDmd : Identifiant de la demande 
   * @returns Structure contenant l'ensemble des objets liés à la demande
   */

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

  /**
   * Retourne l'arborescence d'un Objet repère sauvegardé
   * @param idObjetRepere Identifiant de l'objet repère
   * @param dateDel : Date de création de la demande de suppression traitée
   * @returns  : { OR: { idObjetRepere: any; libelleObjetRepere: any; }; Item: never[]; } OU {status : HttpStatus, error : string}
   */
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

  /**
   * Retourne l'arborescence d'un Item
   * @param idItem Identifiant de l'item
   * @param dateDel Date de création de la demande de suppression traitée
   * @returns { Item: {idItem: any; libelle: any;}; SI: any; } OU { status : HttpStatus, error : string}
   */
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
