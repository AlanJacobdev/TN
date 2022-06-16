import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemService } from 'src/item/item.service';
import { MailService } from 'src/mail/mail.service';
import { ObjetrepereService } from 'src/objetrepere/objetrepere.service';
import { SousitemService } from 'src/sousitem/sousitem.service';
import { Repository } from 'typeorm';
import { CreateDemandeAdminDto } from './dto/create-demande-admin.dto';
import { UpdateDemandeAdminDto } from './dto/update-demande-admin.dto';
import { DemandeAdmin } from './entities/demande-admin.entity';

@Injectable()
export class DemandeAdminService {

  constructor(@InjectRepository(DemandeAdmin) private demandeAdminRepo : Repository<DemandeAdmin>, private objetRepereService : ObjetrepereService, private itemService : ItemService, private sousItemService : SousitemService,  private mailService : MailService){}

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

    const newDemande = this.demandeAdminRepo.create(createDemandeAdminDto);
    await this.sendMail(createDemandeAdminDto.profilCreation, createDemandeAdminDto.motif)
    await this.demandeAdminRepo.save(newDemande);
    return newDemande;
  }

  async sendMail(user : string, motif: string ){
    await this.mailService.sendUserConfirmation(user, motif);
  }

  findAll() {
   return this.demandeAdminRepo.find({
    where : {
      etat : false
    }
    ,order: {
      dateCreation : "ASC"
    }
   });
  }

  findAllTraitee() {
    return this.demandeAdminRepo.find({
     where : {
       etat : true
     }
     ,order: {
       dateCreation : "DESC"
     }
    });
   }


  getAllObjectsFromDmd(idDmd : number) {
    return this.demandeAdminRepo.find({
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

  findOne(id: number) {
    return `This action returns a #${id} demandeAdmin`;
  }

  async update(id: number, updateDemandeAdminDto: UpdateDemandeAdminDto) {
    
      const demande = await this.demandeAdminRepo.findOne({
        where : {
          idDemande : id
        }
      })
      if (demande == undefined) {
        return {
          status : HttpStatus.NOT_FOUND,
          error : 'Identifiant non trouvé'
        }
      }
      if (demande.etat == true){
        return {
          status : HttpStatus.CONFLICT,
          error : 'Demande déja traitée'
        }
      }

      if(updateDemandeAdminDto.isDelete){

       
        
        await this.mailService.sendUserConfirmationDelete(demande.motif)
      } else {


      }

      updateDemandeAdminDto.etat = true;
      updateDemandeAdminDto.dateModification = new Date();
      await this.demandeAdminRepo.update(id, updateDemandeAdminDto);
      return await this.demandeAdminRepo.findOne(id);
  
  

  }

  remove(id: number) {
    return `This action removes a #${id} demandeAdmin`;
  }
}