import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/item/entities/item.entity';
import { Itemsave } from 'src/itemsave/entities/itemsave.entity';
import { Objetrepere } from 'src/objetrepere/entities/objetrepere.entity';
import { Orsave } from 'src/orsave/entities/orsave.entity';
import { Sousitem } from 'src/sousitem/entities/sousitem.entity';
import { Sousitemsave } from 'src/sousitemsave/entities/sousitemsave.entity';
import { UtilisateurService } from 'src/utilisateur/utilisateur.service';
import { Between, In, MoreThan, Repository } from 'typeorm';
import { infoPerDayModified, infoPerMonth, typeInfoPerDay, typeInfoPerMounth } from './interface/structure';


@Injectable()
export class ServiceAccueilService {

  constructor(@InjectRepository(Objetrepere) private OrRepo: Repository<Objetrepere>, @InjectRepository(Orsave) private OrSaveRepo: Repository<Orsave>, @InjectRepository(Item) private itemRepo: Repository<Item>, @InjectRepository(Itemsave) private itemSaveRepo: Repository<Itemsave>,
   @InjectRepository(Sousitem) private SousItemRepo: Repository<Sousitem>, @InjectRepository(Sousitemsave) private SousItemSaveRepo: Repository<Sousitemsave>, private utilisateurService :UtilisateurService) {

  }
  async getNumberOfActivityForEachDay(start: string, end: string, user? : string) {
    
    
    let dateDebut: Date;
    let dateFin: Date;
    let allInfoPerMonth: typeInfoPerMounth = {
      objectCreated: [],
      objectModified: [],
      objectDeleted: []
    }
    let itemCreate: infoPerMonth[] = [];
    let itemCreateSave : infoPerMonth[] = [];
    let itemModify: infoPerMonth[] = [];
    let itemDelete: infoPerMonth[] = [];

    let OrCreate: infoPerMonth[] = [];
    let OrCreateSave: infoPerMonth[] = [];
    let OrModify: infoPerMonth[] = [];
    let OrDelete: infoPerMonth[] = [];

    let sousItemCreate: infoPerMonth[] = [];
    let sousItemCreateSave: infoPerMonth[] = [];
    let sousItemModify: infoPerMonth[] = [];
    let sousItemDelete: infoPerMonth[] = [];

    dateDebut = new Date(start);
    dateFin = new Date(end)
    dateFin.setDate(dateFin.getDate() + 1)

    
    const resultItemCreation = this.itemRepo.createQueryBuilder("Item")
      .select(["TO_CHAR(Item.dateCreation, 'DD-MM-YYYY') as date", "COUNT(TO_CHAR(Item.dateCreation, 'DD-MM-YYYY')) as count"])
      .where("Item.dateCreation BETWEEN :start AND :end", { start: dateDebut, end: dateFin })
      .andWhere("Item.dateModification IS NULL")
      if(user !=undefined){
        resultItemCreation.andWhere("Item.profilCreation = :user", {user: user})
      }
      resultItemCreation.groupBy("TO_CHAR(Item.dateCreation, 'DD-MM-YYYY')")
    try {
      itemCreate = await resultItemCreation.getRawMany();
    } catch (e) {
      return {
        status: HttpStatus.CONFLICT,
        error: e,
      }
    }
     

    const resultItemCreateAndSave = this.itemSaveRepo.createQueryBuilder("Itemsave")
    .select(["TO_CHAR(Itemsave.date, 'DD-MM-YYYY') as date", "COUNT(TO_CHAR(Itemsave.date, 'DD-MM-YYYY')) as count"])
    .where("Itemsave.date BETWEEN :start AND :end", { start: dateDebut, end: dateFin })
    .andWhere("Itemsave.status = 'C'")
    if(user !=undefined){
      resultItemCreateAndSave.andWhere("Itemsave.profilModification = :user", {user: user})
    }
    resultItemCreateAndSave.groupBy("TO_CHAR(Itemsave.date, 'DD-MM-YYYY')")
    try {
      itemCreateSave = await resultItemCreateAndSave.getRawMany();
    } catch (e) {
      return {
        status: HttpStatus.CONFLICT,
        error: "Problème lié à la récupération des items modifiés",
      }
    }
    
    for ( const item of itemCreateSave) {
      let index = itemCreate.findIndex((element) => element.date == item.date)
      if (index != -1) {   

        itemCreate[index].count = +itemCreate[index].count + +item.count   
      } else {
        itemCreate.push(item);
      }
    }
    
    const resultItemModifySave = this.itemSaveRepo.createQueryBuilder("Itemsave")
    .select(["TO_CHAR(Itemsave.date, 'DD-MM-YYYY') as date", "COUNT(TO_CHAR(Itemsave.date, 'DD-MM-YYYY')) as count"])
    .where("Itemsave.date BETWEEN :start AND :end", { start: dateDebut, end: dateFin })
    .andWhere("Itemsave.status = 'M'")
    if(user !=undefined){
      resultItemModifySave.andWhere("Itemsave.profilModification = :user", {user: user})
    }
    resultItemModifySave.groupBy("TO_CHAR(Itemsave.date, 'DD-MM-YYYY')")
    try {
      itemModify = await resultItemModifySave.getRawMany();
    } catch (e) {
      return {
        status: HttpStatus.CONFLICT,
        error: "Problème lié à la récupération des items modifiés",
      }
    }
    let itemModifySave
    const resultItemCreateSave = this.itemRepo.createQueryBuilder("Item")
    .select(["TO_CHAR(Item.dateCreation, 'DD-MM-YYYY') as date", "COUNT(TO_CHAR(Item.dateCreation, 'DD-MM-YYYY')) as count"])
    .where("Item.dateCreation BETWEEN :start AND :end", { start: dateDebut, end: dateFin })
    .andWhere("Item.dateModification IS NOT NULL")
    if(user !=undefined){
      resultItemCreateSave.andWhere("Item.profilCreation = :user", {user: user})
    }
    resultItemCreateSave.groupBy("TO_CHAR(Item.dateCreation, 'DD-MM-YYYY')")
    try {
      itemModifySave = await resultItemCreateSave.getRawMany();
    } catch (e) {
      return {
        status: HttpStatus.CONFLICT,
        error: "Problème lié à la récupération des items modifiés",
      }
    }

    for ( const item of itemModifySave) {
      let index = itemModify.findIndex((element) => element.date == item.date)
      if (index != -1) {   

        itemModify[index].count = +itemModify[index].count + +item.count   
      } else {
        itemModify.push(item);
      }
    }


    const resultItemsaveDelete = this.itemSaveRepo.createQueryBuilder("Itemsave")
      .select(["TO_CHAR(Itemsave.date, 'DD-MM-YYYY') as date", "COUNT(TO_CHAR(Itemsave.date, 'DD-MM-YYYY')) as count"])
      .where("Itemsave.date BETWEEN :start AND :end", { start: dateDebut, end: dateFin })
      .andWhere("Itemsave.status = 'D'")
      if(user !=undefined){
        resultItemsaveDelete.andWhere("Itemsave.profilModification = :user", {user: user})
      }
      resultItemsaveDelete.groupBy("TO_CHAR(Itemsave.date, 'DD-MM-YYYY')")
    try {
      itemDelete = await resultItemsaveDelete.getRawMany();
    } catch (e) {
      return {
        status: HttpStatus.CONFLICT,
        error: "Problème lié à la récupération des items supprimés",
      }
    }

    allInfoPerMonth.objectCreated = itemCreate;
    allInfoPerMonth.objectModified = itemModify;
    allInfoPerMonth.objectDeleted = itemDelete;

    const resultOrCreation = this.OrRepo.createQueryBuilder("Objetrepere")
      .select(["TO_CHAR(Objetrepere.dateCreation, 'DD-MM-YYYY') as date", "COUNT(TO_CHAR(Objetrepere.dateCreation, 'DD-MM-YYYY')) as count"])
      .where("Objetrepere.dateModification IS NULL")
      .andWhere("Objetrepere.dateCreation BETWEEN :start AND :end", { start: dateDebut, end: dateFin })
      if(user !=undefined){
        resultOrCreation.andWhere("Objetrepere.profilCreation = :user", {user: user})
      }
      resultOrCreation.groupBy("TO_CHAR(Objetrepere.dateCreation, 'DD-MM-YYYY')")
    try {
      OrCreate = await resultOrCreation.getRawMany();
    } catch (e) {
      return {
        status: HttpStatus.CONFLICT,
        error: "Problème lié à la récupération des objets repères créés",
      }
    }

    const resultOrCreateSave = this.OrSaveRepo.createQueryBuilder("Orsave")
    .select(["TO_CHAR(Orsave.date, 'DD-MM-YYYY') as date", "COUNT(TO_CHAR(Orsave.date, 'DD-MM-YYYY')) as count"])
    .where("Orsave.date BETWEEN :start AND :end", { start: dateDebut, end: dateFin })
    .andWhere("Orsave.status = 'C'")
    if(user !=undefined){
      resultOrCreateSave.andWhere("Orsave.profilModification = :user", {user: user})
    }
    resultOrCreateSave.groupBy("TO_CHAR(Orsave.date, 'DD-MM-YYYY')")
    try {
      OrCreateSave = await resultOrCreateSave.getRawMany();
    } catch (e) {
      return {
        status: HttpStatus.CONFLICT,
        error: "Problème lié à la récupération des objets repères modifiés",
      }
    }

    for ( const or of OrCreateSave) {
      OrCreate.push(or)
    }


    const resultOrModifySave = this.OrSaveRepo.createQueryBuilder("Orsave")
    .select(["TO_CHAR(Orsave.date, 'DD-MM-YYYY') as date", "COUNT(TO_CHAR(Orsave.date, 'DD-MM-YYYY')) as count"])
    .where("Orsave.date BETWEEN :start AND :end", { start: dateDebut, end: dateFin })
    .andWhere("Orsave.status = 'M'")
    if(user !=undefined){
      resultOrModifySave.andWhere("Orsave.profilModification = :user", {user: user})
    }
    resultOrModifySave.groupBy("TO_CHAR(Orsave.date, 'DD-MM-YYYY')")
    try {
      OrModify = await resultOrModifySave.getRawMany();
    } catch (e) {
      return {
        status: HttpStatus.CONFLICT,
        error: "Problème lié à la récupération des objets repères modifiés",
      }
    }

    let OrModifyCreate;
    const resultOrModifyCreate = this.OrRepo.createQueryBuilder("Objetrepere")
      .select(["TO_CHAR(Objetrepere.dateCreation, 'DD-MM-YYYY') as date", "COUNT(TO_CHAR(Objetrepere.dateCreation, 'DD-MM-YYYY')) as count"])
      .where("Objetrepere.dateModification IS NOT NULL")
      .andWhere("Objetrepere.dateCreation BETWEEN :start AND :end", { start: dateDebut, end: dateFin })
      if(user !=undefined){
        resultOrModifyCreate.andWhere("Objetrepere.profilCreation = :user", {user: user})
      }
      resultOrModifyCreate.groupBy("TO_CHAR(Objetrepere.dateCreation, 'DD-MM-YYYY')")
    try {
      OrModifyCreate = await resultOrModifyCreate.getRawMany();
    } catch (e) {
      return {
        status: HttpStatus.CONFLICT,
        error: "Problème lié à la récupération des objets repères créés",
      }
    }


    for ( const or of OrModifyCreate) {
      let index = OrModify.findIndex((element) => element.date == or.date)
      if (index != -1) {   

        OrModify[index].count = +OrModify[index].count + +or.count   
      } else {
        OrModify.push(or);
      }
    }

    
    const resultOrsaveDelete = this.OrSaveRepo.createQueryBuilder("Orsave")
      .select(["TO_CHAR(Orsave.date, 'DD-MM-YYYY') as date", "COUNT(TO_CHAR(Orsave.date, 'DD-MM-YYYY')) as count"])
      .where("Orsave.date BETWEEN :start AND :end", { start: dateDebut, end: dateFin })
      .andWhere("Orsave.status = 'D'")
      if(user !=undefined){
        resultOrsaveDelete.andWhere("Orsave.profilModification = :user", {user: user})
      }
      resultOrsaveDelete.groupBy("TO_CHAR(Orsave.date, 'DD-MM-YYYY')")
    try {
      OrDelete = await resultOrsaveDelete.getRawMany();
    } catch (e) {
      return {
        status: HttpStatus.CONFLICT,
        error: "Problème lié à la récupération des objets repères supprimés",
      }
    }

    for (const orC of OrCreate) {
      let index = allInfoPerMonth.objectCreated.findIndex((element) => element.date == orC.date)
      if (index != -1) {        
        allInfoPerMonth.objectCreated[index].count = +allInfoPerMonth.objectCreated[index].count + +orC.count   
      } else {
        allInfoPerMonth.objectCreated.push(orC);
      }
    }

    for (const orM of OrModify) {
      
      let index = allInfoPerMonth.objectModified.findIndex((element) => element.date == orM.date)
      
      if (index != -1) {
        allInfoPerMonth.objectModified[index].count = +allInfoPerMonth.objectModified[index].count + +orM.count
      } else {
        allInfoPerMonth.objectModified.push(orM);
      }
    }

    for (const orD of OrDelete) {
      let index = allInfoPerMonth.objectDeleted.findIndex((element) => element.date == orD.date)
      if (index != -1) {
        allInfoPerMonth.objectDeleted[index].count = +allInfoPerMonth.objectDeleted[index].count + +orD.count
      } else {
        allInfoPerMonth.objectDeleted.push(orD);
      }
    }


    const resultSiCreation = this.SousItemRepo.createQueryBuilder("Sousitem")
      .select(["TO_CHAR(Sousitem.dateCreation, 'DD-MM-YYYY') as date", "COUNT(TO_CHAR(Sousitem.dateCreation, 'DD-MM-YYYY')) as count"])
      .where("Sousitem.dateCreation BETWEEN :start AND :end", { start: dateDebut, end: dateFin })
      .andWhere("Sousitem.dateModification IS NULL")
      if(user !=undefined){
        resultSiCreation.andWhere("Sousitem.profilCreation = :user", {user: user})
      }
      resultSiCreation.groupBy("TO_CHAR(Sousitem.dateCreation, 'DD-MM-YYYY')")
    try {
      sousItemCreate = await resultSiCreation.getRawMany();
    } catch (e) {
      return {
        status: HttpStatus.CONFLICT,
        error: "Problème lié à la récupération des sous items créés",
      }
    }

    const resultSiCreateSave = this.SousItemSaveRepo.createQueryBuilder("Sousitemsave")
    .select(["TO_CHAR(Sousitemsave.date, 'DD-MM-YYYY') as date", "COUNT(TO_CHAR(Sousitemsave.date, 'DD-MM-YYYY')) as count"])
    .where("Sousitemsave.date BETWEEN :start AND :end", { start: dateDebut, end: dateFin })
    .andWhere("Sousitemsave.status = 'C'")
    if(user !=undefined){
      resultSiCreateSave.andWhere("Sousitemsave.profilModification = :user", {user: user})
    }
    resultSiCreateSave.groupBy("TO_CHAR(Sousitemsave.date, 'DD-MM-YYYY')")
    
    try {
      sousItemCreateSave = await resultSiCreateSave.getRawMany();
    } catch (e) {
      return {
        status: HttpStatus.CONFLICT,
        error:  "Problème lié à la récupération des sous items modifiés",
      }
    }

    for (const si of sousItemCreateSave) {
      sousItemCreate.push(si)
    }


    const resultSiModifySave = this.SousItemSaveRepo.createQueryBuilder("Sousitemsave")
    .select(["TO_CHAR(Sousitemsave.date, 'DD-MM-YYYY') as date", "COUNT(TO_CHAR(Sousitemsave.date, 'DD-MM-YYYY')) as count"])
    .where("Sousitemsave.date BETWEEN :start AND :end", { start: dateDebut, end: dateFin })
    .andWhere("Sousitemsave.status = 'M' ")
    if(user !=undefined){
      resultSiModifySave.andWhere("Sousitemsave.profilModification = :user", {user: user})
    }
    resultSiModifySave.groupBy("TO_CHAR(Sousitemsave.date, 'DD-MM-YYYY')")
    
    try {
      sousItemModify = await resultSiModifySave.getRawMany();
    } catch (e) {
      return {
        status: HttpStatus.CONFLICT,
        error:  "Problème lié à la récupération des sous items modifiés",
      }
    }

    let sousItemModifyCreate
    const resultSiModifyCreate = this.SousItemRepo.createQueryBuilder("Sousitem")
    .select(["TO_CHAR(Sousitem.dateCreation, 'DD-MM-YYYY') as date", "COUNT(TO_CHAR(Sousitem.dateCreation, 'DD-MM-YYYY')) as count"])
    .where("Sousitem.dateCreation BETWEEN :start AND :end", { start: dateDebut, end: dateFin })
    .andWhere("Sousitem.dateModification IS NOT NULL")
    if(user !=undefined){
      resultSiModifyCreate.andWhere("Sousitem.profilCreation = :user", {user: user})
    }
    resultSiModifyCreate.groupBy("TO_CHAR(Sousitem.dateCreation, 'DD-MM-YYYY')")
    try {
      sousItemModifyCreate = await resultSiModifyCreate.getRawMany();
    } catch (e) {
      return {
        status: HttpStatus.CONFLICT,
        error: "Problème lié à la récupération des sous items créés",
      }
    }
  
    for ( const sousitem of sousItemModifyCreate) {
      let index = sousItemModify.findIndex((element) => element.date == sousitem.date)
      if (index != -1) {   

        sousItemModify[index].count = +sousItemModify[index].count + +sousitem.count   
      } else {
        sousItemModify.push(sousitem);
      }
    }

    

    const resultSisaveDelete = this.SousItemSaveRepo.createQueryBuilder("Sousitemsave")
      .select(["TO_CHAR(Sousitemsave.date, 'DD-MM-YYYY') as date", "COUNT(TO_CHAR(Sousitemsave.date, 'DD-MM-YYYY')) as count"])
      .where("Sousitemsave.date BETWEEN :start AND :end", { start: dateDebut, end: dateFin })
      .andWhere("Sousitemsave.status = 'D'")
      if(user !=undefined){
        resultSisaveDelete.andWhere("Sousitemsave.profilModification = :user", {user: user})
      }
      resultSisaveDelete.groupBy("TO_CHAR(Sousitemsave.date, 'DD-MM-YYYY')")
    try {
      sousItemDelete = await resultSisaveDelete.getRawMany();
    } catch (e) {
      return {
        status: HttpStatus.CONFLICT,
        error:  "Problème lié à la récupération des sous items supprimés",
      }
    }


    for (const siC of sousItemCreate) {
      let index = allInfoPerMonth.objectCreated.findIndex((element) => element.date == siC.date)
      if (index != -1) {
        allInfoPerMonth.objectCreated[index].count = +allInfoPerMonth.objectCreated[index].count + +siC.count
      } else {
        allInfoPerMonth.objectCreated.push(siC);
      }
    }

    for (const siM of sousItemModify) {
      
      
      let index = allInfoPerMonth.objectModified.findIndex((element) => element.date == siM.date)
      if (index != -1) {
        allInfoPerMonth.objectModified[index].count = +allInfoPerMonth.objectModified[index].count + +siM.count
      } else {
        allInfoPerMonth.objectModified.push(siM);
      }
    }

    for (const siD of sousItemDelete) {
      
      let index = allInfoPerMonth.objectDeleted.findIndex((element) => element.date == siD.date)
      if (index != -1) {
        allInfoPerMonth.objectDeleted[index].count = +allInfoPerMonth.objectDeleted[index].count + +siD.count
      } else {
        allInfoPerMonth.objectDeleted.push(siD);
      }
    }

    return allInfoPerMonth;

  }


  /**
   * 
   * @param date 
   * @param user 
   * @returns 
   */

  async getHistoryOfOneDay(date : string, user? :string){
    const dateDebut = new Date(date);
    
    let dateFin = new Date(date);
    dateFin.setDate(dateFin.getDate() + 1)
    
    let InfoPerDay : typeInfoPerDay ={
      objectCreated: [],
      objectModified: [],
      objectDeleted: []
    }

    // Create
    let OrCreate;
    let OrCreateSave;
 

    if (user == undefined){
      OrCreate = await this.OrRepo.find({
        select:['idObjetRepere', 'libelleObjetRepere','etat','profilCreation','dateCreation'],
        where : {
          dateCreation : Between(dateDebut.toISOString(),dateFin.toISOString()),
          dateModification : null
        },
        relations:["description"]
      })
      
      
      
      OrCreateSave = await this.OrSaveRepo.find({
        select:['idObjetRepere','libelleObjetRepere','etat','profilModification','date'],
        where : {
          date : Between(dateDebut.toISOString() ,dateFin.toISOString()),
          status : 'C'
        },
        relations : ["description"]
      })

    } else {
      OrCreate = await this.OrRepo.find({
        select:['idObjetRepere', 'libelleObjetRepere','etat','profilCreation','dateCreation'],
        where : {
          dateCreation : Between(dateDebut.toISOString() ,dateFin.toISOString()),
          profilCreation : user,
          dateModification : null
        },
        relations:["description"]
      })
      OrCreateSave = await this.OrSaveRepo.find({
        select:['idObjetRepere','libelleObjetRepere','etat','profilModification','date'],
        where : {
          date : Between(dateDebut.toISOString() ,dateFin.toISOString()),
          profilModification : user,
          status : 'C'
        },
        relations : ["description"]
      })


    }

    
    for(const or of OrCreate){
      InfoPerDay.objectCreated.push( {
        id : or.idObjetRepere,
        libelle: or.libelleObjetRepere,
        etat: or.etat,
        profilCreation : or.profilCreation,
        dateCreation : or.dateCreation,
        description : or.description,
        typeObjet : 'OR'
      })
    }
    for(const or of OrCreateSave){
      InfoPerDay.objectCreated.push( {
        id : or.idObjetRepere,
        libelle: or.libelleObjetRepere,
        etat: or.etat,
        profilCreation : or.profilModification,
        dateCreation : or.date,
        description : or.description,
        typeObjet : 'OR'
      })
    }


    
    let ItemCreate
    let ItemCreateSave
 
    if (user == undefined){
 
    
    ItemCreate = await this.itemRepo.find({
      select:['idItem', 'libelleItem', 'etat', 'profilCreation', 'dateCreation'],
      where : {
        dateCreation : Between(dateDebut.toISOString(), dateFin.toISOString()),
        dateModification : null
      },
      relations:["description"]
    })

      ItemCreateSave  = await this.itemSaveRepo.find({
        select:['idItem', 'libelleItem', 'etat', 'profilModification', 'date'],
        where : {
          date : Between(dateDebut.toISOString(), dateFin.toISOString()),
          status : 'C'
        },
        relations:["description"]
      })

 

    } else {
      ItemCreate = await this.itemRepo.find({
        select:['idItem', 'libelleItem', 'etat', 'profilCreation', 'dateCreation'],
        where : {
          dateCreation : Between(dateDebut.toISOString(), dateFin.toISOString()),
          dateModification : null,
          profilCreation : user
        },
        relations:["description"]
      })
      ItemCreateSave = await this.itemSaveRepo.find({
        select:['idItem', 'libelleItem', 'etat', 'profilModification', 'date'],
        where : {
          date : Between(dateDebut.toISOString(), dateFin.toISOString()),
          profilModification : user,
          status : 'C'
        },
        relations:["description"]
      })
  
    }

    

    for(const item of ItemCreate){
      InfoPerDay.objectCreated.push( {
        id : item.idItem,
        libelle: item.libelleItem,
        etat: item.etat,
        profilCreation : item.profilCreation,
        dateCreation : item.dateCreation,
        description : item.description,
        typeObjet : 'Item'
      })
    }
    for(const item of ItemCreateSave){
      InfoPerDay.objectCreated.push( {
        id : item.idItem,
        libelle: item.libelleItem,
        etat: item.etat,
        profilCreation : item.profilModification,
        dateCreation : item.date,
        description : item.description,
        typeObjet : 'Item'
      })
    }

    let SiCreate
    let SiCreateSave
    if (user == undefined){
      SiCreate = await this.SousItemRepo.find({
        select:['idSousItem','libelleSousItem','etat','profilCreation','dateCreation'],
        where : {
          dateCreation : Between(dateDebut.toISOString(), dateFin.toISOString()),
          dateModification : null
        },
        relations:["description"]
      })
      SiCreateSave = await this.SousItemSaveRepo.find({
        select:['idSousItem','libelleSousItem','etat','profilModification','date'],
        where : {
          date : Between(dateDebut.toISOString(), dateFin.toISOString()),
          status : 'C'
        },
        relations:["description"]
      })
    } else {
      SiCreate = await this.SousItemRepo.find({
        select:['idSousItem','libelleSousItem','etat','profilCreation','dateCreation'],
        where : {
          dateCreation : Between(dateDebut.toISOString(), dateFin.toISOString()),
          dateModification : null,
          profilCreation : user
        },
        relations:["description"]
      })
      SiCreateSave = await this.SousItemSaveRepo.find({
        select:['idSousItem','libelleSousItem','etat','profilModification','date'],
        where : {
          date : Between(dateDebut.toISOString(), dateFin.toISOString()),
          profilModification : user,
          status : 'C'
        },
        relations:["description"]
      })
    }

    for(const si of SiCreate){
      InfoPerDay.objectCreated.push( {
        id : si.idSousItem,
        libelle: si.libelleSousItem,
        etat: si.etat,
        profilCreation : si.profilCreation,
        dateCreation : si.dateCreation,
        description : si.description,
        typeObjet : 'SI'
      })
    }
    for(const si of SiCreateSave){
      InfoPerDay.objectCreated.push( {
        id : si.idSousItem,
        libelle: si.libelleSousItem,
        etat: si.etat,
        profilCreation : si.profilModification,
        dateCreation : si.date,
        description : si.description,
        typeObjet : 'SI'
      })
    }

    const sortedCreateDesc = InfoPerDay.objectCreated.sort(
      (objA, objB) => objB.dateCreation.getTime() - objA.dateCreation.getTime(),
    );
    InfoPerDay.objectCreated = sortedCreateDesc;

    // Modify
    let OrModify
    if (user == undefined){
      OrModify = await this.OrSaveRepo.find({
        select : ['idObjetRepere','libelleObjetRepere','etat','profilModification','date'],
        where : {
          date : Between(dateDebut.toISOString(),dateFin.toISOString()),
          status : In(['M','C'])
        },
        relations:["description"]
      })
    } else {
      OrModify = await this.OrSaveRepo.find({
        select : ['idObjetRepere','libelleObjetRepere','etat','profilModification','date'],
        where : {
          date : Between(dateDebut.toISOString(),dateFin.toISOString()),
          status : In(['M','C']),
          profilModification : user
        },
        relations:["description"]
      })
    }

    let objetNow : infoPerDayModified= {
      id: '',
      libelle: '',
      etat: '',
      description: [],
      typeObjet: '',
      newlibelle: '',
      newEtat: '',
      newDescription: [],
      profilModification: '',
      dateModification: undefined
    }

   
    
    if ( OrModify.length > 0 ) {
      
      for (const orM of OrModify){
        let error :boolean = false;
        objetNow = {
          id: orM.idObjetRepere,
          libelle: orM.libelleObjetRepere,
          etat: orM.etat,
          description: orM.description,
          typeObjet: 'OR',
          newlibelle: '',
          newEtat: '',
          newDescription: [],
          profilModification: '',
          dateModification: orM.date
        }
        
        let dateDebut = new Date(orM.date)
        dateDebut.setSeconds(dateDebut.getSeconds()-3)
        let dateFin = new Date(orM.date)
        dateFin.setSeconds(dateFin.getSeconds()+1)
        
        
        let OrModify = await this.OrSaveRepo.findOne({
          select : ['idObjetRepere','libelleObjetRepere','etat', 'date','profilModification'],
          where : {
            date : MoreThan(orM.date),
            idObjetRepere : orM.idObjetRepere,
            status : 'M'
          },
          relations:["description"]
        })

        let OrReplaceOrModifyonCreation; 
        if(OrModify == undefined) {
          OrReplaceOrModifyonCreation = await this.OrRepo.findOne({
            select : ['idObjetRepere','libelleObjetRepere','etat', 'profilModification', 'dateModification'],
            where : {
              dateCreation : MoreThan(orM.date),
              idObjetRepere : orM.idObjetRepere
            },
            relations:["description"]
          })
  
            if(OrReplaceOrModifyonCreation == undefined) {
              let orReplaceORModifyonModification;
              orReplaceORModifyonModification = await this.OrRepo.findOne({
                select : ['idObjetRepere','libelleObjetRepere','etat', 'profilModification', 'dateModification'],
                where : {
                  dateModification : MoreThan(orM.date),
                  idObjetRepere : orM.idObjetRepere
                },
                relations:["description"]
              })
              
              if(orReplaceORModifyonModification == undefined){
                error = true;
              } else {
                objetNow.newlibelle = orReplaceORModifyonModification.libelleObjetRepere;
                objetNow.newEtat = orReplaceORModifyonModification.etat;
                objetNow.newDescription = orReplaceORModifyonModification.description;
                objetNow.profilModification = orReplaceORModifyonModification.profilModification;
                objetNow.dateModification = orReplaceORModifyonModification.dateModification;
              }
            } else {

            objetNow.newlibelle = OrReplaceOrModifyonCreation.libelleObjetRepere;
            objetNow.newEtat = OrReplaceOrModifyonCreation.etat;
            objetNow.newDescription = OrReplaceOrModifyonCreation.description;
            objetNow.profilModification = OrReplaceOrModifyonCreation.profilModification;
            objetNow.dateModification = OrReplaceOrModifyonCreation.dateModification;
            }
        } else {
          objetNow.newlibelle = OrModify.libelleObjetRepere;
          objetNow.newEtat = OrModify.etat;
          objetNow.newDescription = OrModify.description;
          objetNow.profilModification = OrModify.profilModification;
          objetNow.dateModification = OrModify.date;
        }
        if (error != true) {
          InfoPerDay.objectModified.push(objetNow);
        }
      }
    }

  

    // Item //
    let ItemModify
    if (user == undefined){
      ItemModify = await this.itemSaveRepo.find({
        select : ['idItem','libelleItem','etat','profilModification','date'],
        where : {
          date : Between(dateDebut.toISOString(),dateFin.toISOString()),
          status : In(['M','C'])
        },
        relations:["description"]
      })
    } else {
      ItemModify = await this.itemSaveRepo.find({
        select : ['idItem','libelleItem','etat','profilModification','date'],
        where : {
          date : Between(dateDebut.toISOString(),dateFin.toISOString()),
          status : In(['M','C']),
          profilModification : user
        },
        relations:["description"]
      })
    }

    
    if ( ItemModify.length > 0 ) {
      for (const itemM of ItemModify){
        let error :boolean = false;
        objetNow = {
          id: itemM.idItem,
          libelle: itemM.libelleItem,
          etat: itemM.etat,
          description: itemM.description,
          typeObjet: 'Item',
          newlibelle: '',
          newEtat: '',
          newDescription: [],
          profilModification: '',
          dateModification: itemM.date
        }

        
        let itemModify = await this.itemSaveRepo.findOne({
          select : ['idItem','libelleItem','etat', 'date','profilModification'],
          where : {
            date : MoreThan(itemM.date),
            idItem : itemM.idItem,
            status:'M'
          },
          relations:["description"]
        })
        

        
        if(itemModify == undefined) {
          let itemReplaceitemModifyonCreation; 
          itemReplaceitemModifyonCreation = await this.itemRepo.findOne({
            select : ['idItem','libelleItem','etat', 'profilModification', 'dateModification'],
            where : {
              dateCreation : MoreThan(itemM.date),
              idItem : itemM.idItem
            },
            relations:["description"]
          })



          if(itemReplaceitemModifyonCreation == undefined) {
            let itemReplaceitemModifyonModification;
            itemReplaceitemModifyonModification = await this.itemRepo.findOne({
              select : ['idItem','libelleItem','etat', 'profilModification', 'dateModification'],
              where : {
                dateModification : MoreThan(itemM.date),
                idItem : itemM.idItem
              },
              relations:["description"]
            })
            if(itemReplaceitemModifyonModification == undefined) {
              error =true;
            } else {
              objetNow.newlibelle = itemReplaceitemModifyonModification.libelleItem;
              objetNow.newEtat = itemReplaceitemModifyonModification.etat;
              objetNow.newDescription = itemReplaceitemModifyonModification.description;
              objetNow.profilModification = itemReplaceitemModifyonModification.profilModification;
              objetNow.dateModification = itemReplaceitemModifyonModification.dateModification
            }
          } else {
            objetNow.newlibelle = itemReplaceitemModifyonCreation.libelleItem;
            objetNow.newEtat = itemReplaceitemModifyonCreation.etat;
            objetNow.newDescription = itemReplaceitemModifyonCreation.description;
            objetNow.profilModification = itemReplaceitemModifyonCreation.profilModification;
            objetNow.dateModification = itemReplaceitemModifyonCreation.dateModification
          }
        } else {
          objetNow.newlibelle = itemModify.libelleItem;
          objetNow.newEtat = itemModify.etat;
          objetNow.newDescription = itemModify.description;
          objetNow.profilModification = itemModify.profilModification;
          objetNow.dateModification = itemModify.date;
        }
        if (error != true) {
          InfoPerDay.objectModified.push(objetNow);
        }
      }
    }


    // Sous-Item
    let SiModify
    if (user == undefined){
      SiModify = await this.SousItemSaveRepo.find({
        select : ['idSousItem','libelleSousItem','etat','profilModification','date'],
        where : {
          date : Between(dateDebut.toISOString(), dateFin.toISOString()),
          status : In(['M','C'])
        },
        relations:["description"]
      })
    } else {
      SiModify = await this.SousItemSaveRepo.find({
        select : ['idSousItem','libelleSousItem','etat','profilModification','date'],
        where : {
          date : Between(dateDebut.toISOString(), dateFin.toISOString()),
          status : In(['M','C']),
          profilModification : user
        },
        relations:["description"]
      })
    }

    
    if ( SiModify.length > 0 ) {
      for (const siM of SiModify){
        let error :boolean = false;
        objetNow = {
          id: siM.idSousItem,
          libelle: siM.libelleSousItem,
          etat: siM.etat,
          description: siM.description,
          typeObjet: 'SI',
          newlibelle: '',
          newEtat: '',
          newDescription: [],
          profilModification: '',
          dateModification: siM.date
        }

        let siModify = await this.SousItemSaveRepo.findOne({
          select : ['idSousItem','libelleSousItem','etat', 'date','profilModification'],
          where : {
            date : MoreThan(siM.date),
            idSousItem : siM.idSousItem,
            status:'M'
          },
          relations:["description"]
        })


        
        
        if(siModify == undefined) {
          let siReplaceSiModifyonCreation; 
          siReplaceSiModifyonCreation = await this.SousItemRepo.findOne({
            select : ['idSousItem','libelleSousItem','etat', 'profilModification', 'dateModification'],
            where : {
              dateCreation : MoreThan(siM.date),
              idSousItem : siM.idSousItem
            },
            relations:["description"]
          })


          if(siReplaceSiModifyonCreation == undefined) {
            let siReplacesiModifyonModification;
            siReplacesiModifyonModification = await this.SousItemRepo.findOne({
              select : ['idSousItem','libelleSousItem','etat', 'profilModification', 'dateModification'],
              where : {
                dateModification : MoreThan(siM.date),
                idSousItem : siM.idSousItem
              },
              relations:["description"]
            })
            if (siReplacesiModifyonModification == undefined){
              error = true
            } else {
              objetNow.newlibelle = siReplacesiModifyonModification.libelleSousItem;
              objetNow.newEtat = siReplacesiModifyonModification.etat;
              objetNow.newDescription = siReplacesiModifyonModification.description;
              objetNow.profilModification = siReplacesiModifyonModification.profilModification;
              objetNow.dateModification = siReplacesiModifyonModification.dateModification;
            }

          } else {
            
            objetNow.newlibelle = siReplaceSiModifyonCreation.libelleSousItem;
            objetNow.newEtat = siReplaceSiModifyonCreation.etat;
            objetNow.newDescription = siReplaceSiModifyonCreation.description;
            objetNow.profilModification = siReplaceSiModifyonCreation.profilModification;
            objetNow.dateModification = siReplaceSiModifyonCreation.dateModification;
          }
        } else {
          objetNow.newlibelle = siModify.libelleSousItem;
          objetNow.newEtat = siModify.etat;
          objetNow.newDescription = siModify.description;
          objetNow.profilModification = siModify.profilModification;
          objetNow.dateModification = siModify.date;
        }
        if (error != true) {
          InfoPerDay.objectModified.push(objetNow);
        }
      }
    }


      
      const sortedModifyDesc = InfoPerDay.objectModified.sort(
        (objA, objB) => objB.dateModification.getTime() - objA.dateModification.getTime(),
      );
      InfoPerDay.objectModified = sortedModifyDesc;


      // Delete
      let OrDelete
      if (user == undefined){
        OrDelete = await this.OrSaveRepo.find({
          select:['idObjetRepere', 'libelleObjetRepere','etat','profilModification','date'],
          where : {
            date : Between(dateDebut.toISOString(), dateFin.toISOString()),
            status : 'D'
          },
          relations:["description"]
        })
      } else {
        OrDelete = await this.OrSaveRepo.find({
          select:['idObjetRepere', 'libelleObjetRepere','etat','profilModification','date'],
          where : {
            date : Between(dateDebut.toISOString(), dateFin.toISOString()),
            status : 'D',
            profilModification : user
          },
          relations:["description"]
        })
      }
  
      for(const or of OrDelete){
        InfoPerDay.objectDeleted.push( {
          id : or.idObjetRepere,
          libelle: or.libelleObjetRepere,
          etat: or.etat,
          profilSuppression : or.profilModification,
          dateSuppression : or.date,
          description : or.description,
          typeObjet : 'OR'
        })
      }
  
      let ItemDelete
      if (user == undefined){
        ItemDelete = await this.itemSaveRepo.find({
          select:['idItem', 'libelleItem', 'etat', 'profilModification', 'date'],
          where : {
            date: Between(dateDebut.toISOString(), dateFin.toISOString()),
            status : 'D'
          },
          relations:["description"]
        })
      } else {
        ItemDelete = await this.itemSaveRepo.find({
          select:['idItem', 'libelleItem', 'etat', 'profilModification', 'date'],
          where : {
            date: Between(dateDebut.toISOString(), dateFin.toISOString()),
            status : 'D',
            profilModification : user
          },
          relations:["description"]
        })
      }

  
      for(const item of ItemDelete){
        InfoPerDay.objectDeleted.push( {
          id : item.idItem,
          libelle: item.libelleItem,
          etat: item.etat,
          profilSuppression : item.profilModification,
          dateSuppression : item.date,
          description : item.description,
          typeObjet : 'Item'
        })
      }

      let SiDelete
      if (user == undefined){
        SiDelete = await this.SousItemSaveRepo.find({
          select:['idSousItem','libelleSousItem','etat','profilModification','date'],
          where : {
            date : Between(dateDebut.toISOString(), dateFin.toISOString()),
            status : 'D'
          },
          relations:["description"]
        })
      } else {
        SiDelete = await this.SousItemSaveRepo.find({
          select:['idSousItem','libelleSousItem','etat','profilModification','date'],
          where : {
            date : Between(dateDebut.toISOString(), dateFin.toISOString()),
            status : 'D',
            profilModification: user
          },
          relations:["description"]
        })
      }
      for(const si of SiDelete){
        InfoPerDay.objectDeleted.push( {
          id : si.idSousItem,
          libelle: si.libelleSousItem,
          etat: si.etat,
          profilSuppression : si.profilModification,
          dateSuppression : si.date,
          description : si.description,
          typeObjet : 'SI'
        })
      }

    const sortedDeleteDesc = InfoPerDay.objectDeleted.sort(
      (objA, objB) => objB.dateSuppression.getTime() - objA.dateSuppression.getTime(),
    );
    InfoPerDay.objectDeleted = sortedDeleteDesc;

    for (const create of InfoPerDay.objectCreated){
      const profil = await this.utilisateurService.findOneByLogin(create.profilCreation);
      if (profil != undefined){
        create.profilCreation = profil.nom.toUpperCase() + " " + profil.prenom
      }
    }

    for (const edit of InfoPerDay.objectModified){
      const profil = await this.utilisateurService.findOneByLogin(edit.profilModification);
      if (profil != undefined){
        edit.profilModification = profil.nom.toUpperCase() + " " + profil.prenom
      }
    }

    for (const del of InfoPerDay.objectDeleted){
      const profil = await this.utilisateurService.findOneByLogin(del.profilSuppression);
      if (profil != undefined){
        del.profilSuppression = profil.nom.toUpperCase() + " " + profil.prenom
      }
    }
    return InfoPerDay;
    
    
  }


}
