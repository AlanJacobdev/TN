import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DemandeAdminTraiteeService } from 'src/demande-admin-traitee/demande-admin-traitee.service';
import { CreateDemandeAdminTraiteeDto } from 'src/demande-admin-traitee/dto/create-demande-admin-traitee.dto';
import { objetTraitee } from 'src/demande-admin-traitee/interface/interfaceDmdTraitee';
import { ItemService } from 'src/item/item.service';
import { MailService } from 'src/mail/mail.service';
import { ObjetrepereService } from 'src/objetrepere/objetrepere.service';
import { ServiceSuppressionService } from 'src/service-suppression/service-suppression.service';
import { SousitemService } from 'src/sousitem/sousitem.service';
import { UtilisateurService } from 'src/utilisateur/utilisateur.service';
import { Repository } from 'typeorm';
import { CreateDemandeAdminDto } from './dto/create-demande-admin.dto';

import { DemandeAdmin } from './entities/demande-admin.entity';

@Injectable()
export class DemandeAdminService {

  constructor(@InjectRepository(DemandeAdmin) private demandeAdminRepo : Repository<DemandeAdmin>, private objetRepereService : ObjetrepereService, 
  private itemService : ItemService, private sousItemService : SousitemService,  private mailService : MailService, private utilisateurService : UtilisateurService,
  private serviceSuppression: ServiceSuppressionService, private demandeAdminTraiteeService : DemandeAdminTraiteeService){}

  async create(createDemandeAdminDto: CreateDemandeAdminDto) {

    
    createDemandeAdminDto.dateCreation = new Date();

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
    createDemandeAdminDto.orDelete = tabDmdOr;
    createDemandeAdminDto.itemDelete = tabDmdItem;
    createDemandeAdminDto.sousItemDelete = tabDmdSi;

    const newDemande = this.demandeAdminRepo.create(createDemandeAdminDto);
    await this.sendMail(createDemandeAdminDto.profilCreation, createDemandeAdminDto.motif)
    await this.demandeAdminRepo.save(newDemande);
    return newDemande;
  }

  async sendMail(user : string, motif: string ){
    await this.mailService.sendUserConfirmation(user, motif);
  }

  async findAll() {
   const demandes = await this.demandeAdminRepo.find({
    order: {
      dateCreation : "ASC"
    }
   });

   for (const d of demandes) {
    const profil = await this.utilisateurService.findOneByLogin(d.profilCreation);
    d.profilCreation = (profil.nom).toUpperCase() +" "+profil.prenom
   }

   return demandes
  }

  async getAllObjectsFromDmd(idDmd : number) {
    let demande = await this.demandeAdminRepo.findOne({
      where : {
        "idDemande" : idDmd
      },
      join :  {
        alias : "demandeAdmin",
        leftJoinAndSelect : {
          item : "demandeAdmin.itemDelete",
          sousitem : "demandeAdmin.sousItemDelete",
          objetrepere : "demandeAdmin.orDelete"
        } 
      }
    })
    
    const profilCreation = await this.utilisateurService.findOneByLogin(demande.profilCreation);
    if (profilCreation != undefined){
      demande.profilCreation = (profilCreation.nom).toUpperCase() +" "+ profilCreation.prenom
    }

    return demande
  } 

  async getAllObjectsFromDmdWithOutName(idDmd : number) {
    return this.demandeAdminRepo.findOne({
      where : {
        "idDemande" : idDmd
      },
      join :  {
        alias : "demandeAdmin",
        leftJoinAndSelect : {
          item : "demandeAdmin.itemDelete",
          sousitem : "demandeAdmin.sousItemDelete",
          objetrepere : "demandeAdmin.orDelete"
        } 
      }
    })
  } 

  async remove(id: number, profil : string, accept : boolean) {
      const demande = await this.getAllObjectsFromDmdWithOutName(id)
      
      if (demande == undefined) {
        return {
          status : HttpStatus.NOT_FOUND,
          error : 'Identifiant non trouvé'
        }
      }
      let listOR= [];
      if (demande.orDelete != undefined) {
        for (const or of demande.orDelete){
          listOR.push(or.idObjetRepere)
        }
      }
      
      let listItem = [];
      if (demande.itemDelete != undefined){
        for (const item of demande.itemDelete){
          listItem.push(item.idItem)
        }
      }

      let listSI = [];
      if (demande.sousItemDelete != undefined) {
        for (const si of demande.sousItemDelete){
          listSI.push(si.idSousItem)
        }
      }

      const deleteObjet = {
        listeOR : listOR,
        listeItem : listItem,
        listeSI : listSI
      }
      
      let dateRemove = new Date(); 
      try {
    
      await this.serviceSuppression.deleteObject(profil, deleteObjet, true, dateRemove)
      } catch (e) {
        return e 
      }
    
      const Dmd = await this.demandeAdminRepo.findOne({
        where : {
          idDemande : id,
        }
      })
      if ( Dmd == undefined) {
        throw new HttpException({
          status : HttpStatus.NOT_FOUND,
          error : 'Demande inconnue',
        }, HttpStatus.NOT_FOUND);
      }
      
      let orTraitee : objetTraitee[] = []
      let itemTraitee : objetTraitee[] = []
      let siTraitee : objetTraitee[] = []

      for (const or of deleteObjet.listeOR) {
        orTraitee.push({
          id : or,
          date : dateRemove 
        })
      }

      for (const item of deleteObjet.listeItem) {
        itemTraitee.push({
          id : item,
          date : dateRemove 
        })
      }

      for (const si of deleteObjet.listeSI) {
        siTraitee.push({
          id : si,
          date : dateRemove 
        })
      }

      let dmdTraitee : CreateDemandeAdminTraiteeDto = {
        motif: Dmd.motif,
        isDelete: Boolean(accept),
        orDelete: orTraitee,
        itemDelete: itemTraitee,
        sousItemDelete: siTraitee,
        profilCreation: Dmd.profilCreation,
        dateCreation: Dmd.dateCreation,
        profilModification: profil,
        dateModification: dateRemove
      } ;
     
      
      await this.demandeAdminTraiteeService.create(dmdTraitee);   
  
      try {
        await this.demandeAdminRepo.delete(id);
      } catch ( e : any) {
        return e
      }
      
      if (accept) {
        await this.mailService.sendUserConfirmationDelete(demande.profilCreation, demande.motif)
      }

      return {
        status : HttpStatus.OK,
        message :'Demande traitée',
      }
  }

  async getArborescenceOfOR(idObjetRepere : string) {
    const orExist = await this.objetRepereService.findOne(idObjetRepere);
    let allItemAndSIOfOR = [];
    if (orExist != undefined) {
      const allItemOfOR = await this.itemService.findAllItemOfOR(idObjetRepere);
      if(allItemOfOR.length != 0){
        for( const item of allItemOfOR) {
          const allSiOfItem = await this.sousItemService.findAllSousItemOfItemUseful(item.idItem);
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


  async getArborescenceOfItem(idItem : string) {
    const itemExist = await this.itemService.findOne(idItem);
    if (itemExist != undefined) {
      const SiofItem= await this.sousItemService.findAllSousItemOfItemUseful(idItem);
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
