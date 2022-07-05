import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/item/entities/item.entity';
import { Itemsave } from 'src/itemsave/entities/itemsave.entity';
import { Objetrepere } from 'src/objetrepere/entities/objetrepere.entity';
import { Orsave } from 'src/orsave/entities/orsave.entity';
import { Sousitem } from 'src/sousitem/entities/sousitem.entity';
import { Sousitemsave } from 'src/sousitemsave/entities/sousitemsave.entity';
import { Between, MoreThan, Repository } from 'typeorm';
import { infoPerDayModified, infoPerMonth, typeInfoPerDay, typeInfoPerMounth } from './interface/structure';

@Injectable()
export class ServiceAccueilService {

  constructor(@InjectRepository(Objetrepere) private OrRepo: Repository<Objetrepere>, @InjectRepository(Orsave) private OrSaveRepo: Repository<Orsave>, @InjectRepository(Item) private itemRepo: Repository<Item>, @InjectRepository(Itemsave) private itemSaveRepo: Repository<Itemsave>, @InjectRepository(Sousitem) private SousItemRepo: Repository<Sousitem>, @InjectRepository(Sousitemsave) private SousItemSaveRepo: Repository<Sousitemsave>) {

  }
  async getNumberOfActivityForEachDay(start: string, end: string) {
    
    
    let dateDebut: Date;
    let dateFin: Date;
    let allInfoPerMonth: typeInfoPerMounth = {
      objectCreated: [],
      objectModified: [],
      objectDeleted: []
    }
    let itemCreate: infoPerMonth[] = [];
    let itemModify: infoPerMonth[] = [];
    let itemDelete: infoPerMonth[] = [];

    let OrCreate: infoPerMonth[] = [];
    let OrModify: infoPerMonth[] = [];
    let OrDelete: infoPerMonth[] = [];

    let sousItemCreate: infoPerMonth[] = [];
    let sousItemModify: infoPerMonth[] = [];
    let sousItemDelete: infoPerMonth[] = [];

    dateDebut = new Date(start);
    dateFin = new Date(end)
    dateFin.setDate(dateFin.getDate() + 1)

    const resultItemCreation = this.itemRepo.createQueryBuilder("Item")
      .select(["TO_CHAR(Item.dateCreation, 'DD-MM-YYYY') as date", "COUNT(TO_CHAR(Item.dateCreation, 'DD-MM-YYYY')) as count"])
      .where("Item.dateCreation BETWEEN :start AND :end", { start: dateDebut, end: dateFin })
      .groupBy("TO_CHAR(Item.dateCreation, 'DD-MM-YYYY')")
    try {
      itemCreate = await resultItemCreation.getRawMany();
    } catch (e) {
      return {
        status: HttpStatus.CONFLICT,
        error: "Problème lié à la récupération des items créés",
      }
    }


    const resultItemModify = this.itemSaveRepo.createQueryBuilder("Itemsave")
    .select(["TO_CHAR(Itemsave.date, 'DD-MM-YYYY') as date", "COUNT(TO_CHAR(Itemsave.date, 'DD-MM-YYYY')) as count"])
    .where("Itemsave.date BETWEEN :start AND :end", { start: dateDebut, end: dateFin })
    .andWhere("Itemsave.status = 'M'")
    .groupBy("TO_CHAR(Itemsave.date, 'DD-MM-YYYY')")
    try {
      itemModify = await resultItemModify.getRawMany();
    } catch (e) {
      return {
        status: HttpStatus.CONFLICT,
        error: "Problème lié à la récupération des items modifiés",
      }
    }

    const resultItemsaveDelete = this.itemSaveRepo.createQueryBuilder("Itemsave")
      .select(["TO_CHAR(Itemsave.date, 'DD-MM-YYYY') as date", "COUNT(TO_CHAR(Itemsave.date, 'DD-MM-YYYY')) as count"])
      .where("Itemsave.date BETWEEN :start AND :end", { start: dateDebut, end: dateFin })
      .andWhere("Itemsave.status = 'D'")
      .groupBy("TO_CHAR(Itemsave.date, 'DD-MM-YYYY')")
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
      .where("Objetrepere.dateCreation BETWEEN :start AND :end", { start: dateDebut, end: dateFin })
      .groupBy("TO_CHAR(Objetrepere.dateCreation, 'DD-MM-YYYY')")
    try {
      OrCreate = await resultOrCreation.getRawMany();
    } catch (e) {
      return {
        status: HttpStatus.CONFLICT,
        error: "Problème lié à la récupération des objets repères créés",
      }
    }

    const resultOrModify = this.OrSaveRepo.createQueryBuilder("Orsave")
    .select(["TO_CHAR(Orsave.date, 'DD-MM-YYYY') as date", "COUNT(TO_CHAR(Orsave.date, 'DD-MM-YYYY')) as count"])
    .where("Orsave.date BETWEEN :start AND :end", { start: dateDebut, end: dateFin })
    .andWhere("Orsave.status = 'M'")
    .groupBy("TO_CHAR(Orsave.date, 'DD-MM-YYYY')")
    try {
      OrModify = await resultOrModify.getRawMany();
    } catch (e) {
      return {
        status: HttpStatus.CONFLICT,
        error: "Problème lié à la récupération des objets repères modifiés",
      }
    }

    const resultOrsaveDelete = this.OrSaveRepo.createQueryBuilder("Orsave")
      .select(["TO_CHAR(Orsave.date, 'DD-MM-YYYY') as date", "COUNT(TO_CHAR(Orsave.date, 'DD-MM-YYYY')) as count"])
      .where("Orsave.date BETWEEN :start AND :end", { start: dateDebut, end: dateFin })
      .andWhere("Orsave.status = 'D'")
      .groupBy("TO_CHAR(Orsave.date, 'DD-MM-YYYY')")
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
      .groupBy("TO_CHAR(Sousitem.dateCreation, 'DD-MM-YYYY')")
    try {
      sousItemCreate = await resultSiCreation.getRawMany();
    } catch (e) {
      return {
        status: HttpStatus.CONFLICT,
        error: "Problème lié à la récupération des sous items créés",
      }
    }

    const resultSiModify = this.SousItemSaveRepo.createQueryBuilder("Sousitemsave")
    .select(["TO_CHAR(Sousitemsave.date, 'DD-MM-YYYY') as date", "COUNT(TO_CHAR(Sousitemsave.date, 'DD-MM-YYYY')) as count"])
    .where("Sousitemsave.date BETWEEN :start AND :end", { start: dateDebut, end: dateFin })
    .andWhere("Sousitemsave.status = 'M'")
    .groupBy("TO_CHAR(Sousitemsave.date, 'DD-MM-YYYY')")
    try {
      sousItemModify = await resultSiModify.getRawMany();
    } catch (e) {
      return {
        status: HttpStatus.CONFLICT,
        error:  "Problème lié à la récupération des sous items modifiés",
      }
    }

    const resultSisaveDelete = this.SousItemSaveRepo.createQueryBuilder("Sousitemsave")
      .select(["TO_CHAR(Sousitemsave.date, 'DD-MM-YYYY') as date", "COUNT(TO_CHAR(Sousitemsave.date, 'DD-MM-YYYY')) as count"])
      .where("Sousitemsave.date BETWEEN :start AND :end", { start: dateDebut, end: dateFin })
      .andWhere("Sousitemsave.status = 'D'")
      .groupBy("TO_CHAR(Sousitemsave.date, 'DD-MM-YYYY')")
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



  async getHistoryOfOneDay(date : string){
    const dateDebut = new Date(date);
    let dateFin = new Date(date);
    dateFin.setDate(dateFin.getDate() + 1)
    let InfoPerDay : typeInfoPerDay ={
      objectCreated: [],
      objectModified: [],
      objectDeleted: []
    }

    // Create

    let OrCreate = await this.OrRepo.find({
      select:['idObjetRepere', 'libelleObjetRepere','etat','profilCreation','dateCreation'],
      where : {
        dateCreation : Between(dateDebut,dateFin)
      },
      relations:["description"]
    })

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


    let ItemCreate = await this.itemRepo.find({
      select:['idItem', 'libelleItem', 'etat', 'profilCreation', 'dateCreation'],
      where : {
        dateCreation : Between(dateDebut, dateFin)
      },
      relations:["description"]
    })

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

    let SiCreate = await this.SousItemRepo.find({
      select:['idSousItem','libelleSousItem','etat','profilCreation','dateCreation'],
      where : {
        dateCreation : Between(dateDebut, dateFin)
      },
      relations:["description"]
    })

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

    const sortedCreateDesc = InfoPerDay.objectCreated.sort(
      (objA, objB) => objB.dateCreation.getTime() - objA.dateCreation.getTime(),
    );
    InfoPerDay.objectCreated = sortedCreateDesc;

    // Modify

    let OrModify = await this.OrSaveRepo.find({
      select : ['idObjetRepere','libelleObjetRepere','etat','profilModification','date'],
      where : {
        date : Between(dateDebut,dateFin),
        status : 'M'
      },
      relations:["description"]
    })

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
            status : 'M',
            profilModification : orM.profilModification,
            idObjetRepere : orM.idObjetRepere
          },
          relations:["description"]
        })

        let OrReplaceOrModify; 
        if(OrModify == undefined) {
          OrReplaceOrModify = await this.OrRepo.findOne({
            select : ['idObjetRepere','libelleObjetRepere','etat', 'profilModification', 'dateModification'],
            where : {
              dateModification : Between(dateDebut,dateFin),
              profilModification : orM.profilModification,
              idObjetRepere : orM.idObjetRepere
            },
            relations:["description"]
          })
            objetNow.newlibelle = OrReplaceOrModify.libelleObjetRepere;
            objetNow.newEtat = OrReplaceOrModify.etat;
            objetNow.newDescription = OrReplaceOrModify.description;
            objetNow.profilModification = OrReplaceOrModify.profilModification;
        } else {
          objetNow.newlibelle = OrModify.libelleObjetRepere;
          objetNow.newEtat = OrModify.etat;
          objetNow.newDescription = OrModify.description;
          objetNow.profilModification = OrModify.profilModification;
        }

        InfoPerDay.objectModified.push(objetNow);
      }
    }



    // Item //

    let ItemModify = await this.itemSaveRepo.find({
      select : ['idItem','libelleItem','etat','profilModification','date'],
      where : {
        date : Between(dateDebut,dateFin),
        status : 'M'
      },
      relations:["description"]
    })

    if ( ItemModify.length > 0 ) {
      for (const itemM of ItemModify){
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
        let dateDebut = new Date(itemM.date)
        dateDebut.setSeconds(dateDebut.getSeconds()-3)
        let dateFin = new Date(itemM.date)
        dateFin.setSeconds(dateFin.getSeconds()+1)
        
        let itemModify = await this.itemSaveRepo.findOne({
          select : ['idItem','libelleItem','etat', 'date','profilModification'],
          where : {
            date : MoreThan(itemM.date),
            profilModification : itemM.profilModification,
            idItem : itemM.idItem
          },
          relations:["description"]
        })

        let itemReplaceitemModify; 
        if(itemModify == undefined) {
          itemReplaceitemModify = await this.itemRepo.findOne({
            select : ['idItem','libelleItem','etat', 'profilModification', 'dateModification'],
            where : {
              dateModification : Between(dateDebut,dateFin),
              profilModification : itemM.profilModification,
              idItem : itemM.idItem
            },
            relations:["description"]
          })
          objetNow.newlibelle = itemReplaceitemModify.libelleItem;
          objetNow.newEtat = itemReplaceitemModify.etat;
          objetNow.newDescription = itemReplaceitemModify.description;
          objetNow.profilModification = itemReplaceitemModify.profilModification;
        } else {
          objetNow.newlibelle = itemModify.libelleItem;
          objetNow.newEtat = itemModify.etat;
          objetNow.newDescription = itemModify.description;
          objetNow.profilModification = itemModify.profilModification;
        }

        InfoPerDay.objectModified.push(objetNow);
      }
    }


    // Sous-Item

    let SiModify = await this.SousItemSaveRepo.find({
      select : ['idSousItem','libelleSousItem','etat','profilModification','date'],
      where : {
        date : Between(dateDebut,dateFin),
        status : 'M'
      },
      relations:["description"]
    })

    if ( SiModify.length > 0 ) {
      for (const siM of SiModify){
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
        let dateDebut = new Date(siM.date)
        dateDebut.setSeconds(dateDebut.getSeconds()-3)
        let dateFin = new Date(siM.date)
        dateFin.setSeconds(dateFin.getSeconds()+1)

        let siModify = await this.SousItemSaveRepo.findOne({
          select : ['idSousItem','libelleSousItem','etat', 'date','profilModification'],
          where : {
            date : MoreThan(siM.date),
            profilModification : siM.profilModification,
            idSousItem : siM.idSousItem
          },
          relations:["description"]
        })

        let siReplaceSiModify; 
        if(siModify == undefined) {
          siReplaceSiModify = await this.SousItemRepo.findOne({
            select : ['idSousItem','libelleSousItem','etat', 'profilModification', 'dateModification'],
            where : {
              dateModification : Between(dateDebut,dateFin),
              profilModification : siM.profilModification,
              idSousItem : siM.idSousItem
            },
            relations:["description"]
          })
            objetNow.newlibelle = siReplaceSiModify.libelleSousItem;
            objetNow.newEtat = siReplaceSiModify.etat;
            objetNow.newDescription = siReplaceSiModify.description;
            objetNow.profilModification = siReplaceSiModify.profilModification;
          
        } else {
          objetNow.newlibelle = siModify.libelleSousItem;
          objetNow.newEtat = siModify.etat;
          objetNow.newDescription = siModify.description;
          objetNow.profilModification = siModify.profilModification;
        }
        InfoPerDay.objectModified.push(objetNow);
      }
    }
      const sortedModifyDesc = InfoPerDay.objectModified.sort(
        (objA, objB) => objB.dateModification.getTime() - objA.dateModification.getTime(),
      );
      InfoPerDay.objectModified = sortedModifyDesc;


      // Delete

      let OrDelete = await this.OrSaveRepo.find({
        select:['idObjetRepere', 'libelleObjetRepere','etat','profilModification','date'],
        where : {
          date : Between(dateDebut,dateFin),
          status : 'D'
        },
        relations:["description"]
      })
  
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
  
  
      let ItemDelete = await this.itemSaveRepo.find({
        select:['idItem', 'libelleItem', 'etat', 'profilModification', 'date'],
        where : {
          date: Between(dateDebut, dateFin),
          status : 'D'
        },
        relations:["description"]
      })
  
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
  
      let SiDelete = await this.SousItemSaveRepo.find({
        select:['idSousItem','libelleSousItem','etat','profilModification','date'],
        where : {
          date : Between(dateDebut, dateFin),
          status : 'D'
        },
        relations:["description"]
      })
  
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

    return InfoPerDay;
    
    
  }



  findAll() {
    return `This action returns all serviceAccueil`;
  }

  findOne(id: number) {
    return `This action returns a #${id} serviceAccueil`;
  }

}
