import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReplaySubject } from 'rxjs';
import { Item } from 'src/item/entities/item.entity';
import { Itemsave } from 'src/itemsave/entities/itemsave.entity';
import { Objetrepere } from 'src/objetrepere/entities/objetrepere.entity';
import { Orsave } from 'src/orsave/entities/orsave.entity';
import { Sousitem } from 'src/sousitem/entities/sousitem.entity';
import { SousitemModule } from 'src/sousitem/sousitem.module';
import { Sousitemsave } from 'src/sousitemsave/entities/sousitemsave.entity';
import { Between, Brackets, Repository } from 'typeorm';
import { infoPerMonth, typeInfoPerDay, typeInfoPerMounth } from './interface/structure';

@Injectable()
export class ServiceAccueilService {

  constructor(@InjectRepository(Objetrepere) private OrRepo: Repository<Objetrepere>, @InjectRepository(Orsave) private OrSaveRepo: Repository<Orsave>, @InjectRepository(Item) private itemRepo: Repository<Item>, @InjectRepository(Itemsave) private itemSaveRepo: Repository<Itemsave>, @InjectRepository(Sousitem) private SousItemRepo: Repository<Sousitem>, @InjectRepository(Sousitemsave) private SousItemSaveRepo: Repository<Sousitem>) {

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
      .select(["CONCAT(DAY(Item.dateCreation), '-', FORMAT(Item.dateCreation,'MM'), '-', YEAR(Item.dateCreation)) as date", 'COUNT(DAY(Item.dateCreation)) as count'])
      .where("Item.dateCreation BETWEEN :start AND :end", { start: dateDebut, end: dateFin })
      .groupBy("DAY(Item.dateCreation)")
      .addGroupBy("FORMAT(Item.dateCreation,'MM')")
      .addGroupBy("YEAR(Item.dateCreation)")
    try {
      itemCreate = await resultItemCreation.getRawMany();
    } catch (e) {
      return {
        status: HttpStatus.CONFLICT,
        error: "Problème lié à la récupération des items créés",
      }
    }

    const resultItemModify = this.itemSaveRepo.createQueryBuilder("Itemsave")
    .select(["CONCAT(DAY(Itemsave.date), '-', FORMAT(Itemsave.date,'MM'), '-', YEAR(Itemsave.date)) as date", 'COUNT(DAY(Itemsave.date)) as count'])
    .where("Itemsave.date BETWEEN :start AND :end", { start: dateDebut, end: dateFin })
    .andWhere("Itemsave.status = 'M'")
    .groupBy("DAY(Itemsave.date)")
    .addGroupBy("FORMAT(Itemsave.date,'MM')")
    .addGroupBy("YEAR(Itemsave.date)")
    try {
      itemModify = await resultItemModify.getRawMany();
    } catch (e) {
      return {
        status: HttpStatus.CONFLICT,
        error: "Problème lié à la récupération des items modifiés",
      }
    }

    const resultItemsaveDelete = this.itemSaveRepo.createQueryBuilder("Itemsave")
      .select(["CONCAT(DAY(Itemsave.date), '-', FORMAT(Itemsave.date,'MM'), '-', YEAR(Itemsave.date)) as date", 'COUNT(DAY(Itemsave.date)) as count'])
      .where("Itemsave.date BETWEEN :start AND :end", { start: dateDebut, end: dateFin })
      .andWhere("Itemsave.status = 'D'")
      .groupBy("DAY(Itemsave.date)")
      .addGroupBy("FORMAT(Itemsave.date,'MM')")
      .addGroupBy("YEAR(Itemsave.date)")
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
      .select(["CONCAT(DAY(Objetrepere.dateCreation), '-', FORMAT(Objetrepere.dateCreation,'MM'), '-', YEAR(Objetrepere.dateCreation)) as date", 'COUNT(DAY(Objetrepere.dateCreation)) as count'])
      .where("Objetrepere.dateCreation BETWEEN :start AND :end", { start: dateDebut, end: dateFin })
      .groupBy("DAY(Objetrepere.dateCreation)")
      .addGroupBy("FORMAT(Objetrepere.dateCreation,'MM')")
      .addGroupBy("YEAR(Objetrepere.dateCreation)")
    try {
      OrCreate = await resultOrCreation.getRawMany();
    } catch (e) {
      return {
        status: HttpStatus.CONFLICT,
        error: "Problème lié à la récupération des objets repères créés",
      }
    }

    const resultOrModify = this.OrSaveRepo.createQueryBuilder("Orsave")
    .select(["CONCAT(DAY(Orsave.date), '-', FORMAT(Orsave.date,'MM'), '-', YEAR(Orsave.date)) as date", 'COUNT(DAY(Orsave.date)) as count'])
    .where("Orsave.date BETWEEN :start AND :end", { start: dateDebut, end: dateFin })
    .andWhere("Orsave.status = 'M'")
    .groupBy("DAY(Orsave.date)")
    .addGroupBy("FORMAT(Orsave.date,'MM')")
    .addGroupBy("YEAR(Orsave.date)")
    try {
      OrModify = await resultOrModify.getRawMany();
    } catch (e) {
      return {
        status: HttpStatus.CONFLICT,
        error: "Problème lié à la récupération des objets repères modifiés",
      }
    }

    const resultOrsaveDelete = this.OrSaveRepo.createQueryBuilder("Orsave")
      .select(["CONCAT(DAY(Orsave.date), '-', FORMAT(Orsave.date,'MM'), '-', YEAR(Orsave.date)) as date", 'COUNT(DAY(Orsave.date)) as count'])
      .where("Orsave.date BETWEEN :start AND :end", { start: dateDebut, end: dateFin })
      .andWhere("Orsave.status = 'D'")
      .groupBy("DAY(Orsave.date)")
      .addGroupBy("FORMAT(Orsave.date,'MM')")
      .addGroupBy("YEAR(Orsave.date)")
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
        allInfoPerMonth.objectCreated[index].count = allInfoPerMonth.objectCreated[index].count + orC.count
      } else {
        allInfoPerMonth.objectCreated.push(orC);
      }
    }

    for (const orM of OrModify) {
      let index = allInfoPerMonth.objectModified.findIndex((element) => element.date == orM.date)
      if (index != -1) {
        allInfoPerMonth.objectModified[index].count = allInfoPerMonth.objectModified[index].count + orM.count
      } else {
        allInfoPerMonth.objectModified.push(orM);
      }
    }

    for (const orD of OrDelete) {
      let index = allInfoPerMonth.objectDeleted.findIndex((element) => element.date == orD.date)
      if (index != -1) {
        allInfoPerMonth.objectDeleted[index].count = allInfoPerMonth.objectDeleted[index].count + orD.count
      } else {
        allInfoPerMonth.objectDeleted.push(orD);
      }
    }


    const resultSiCreation = this.SousItemRepo.createQueryBuilder("Sousitem")
      .select(["CONCAT(DAY(Sousitem.dateCreation), '-', FORMAT(Sousitem.dateCreation ,'MM'), '-', YEAR(Sousitem.dateCreation)) as date", 'COUNT(DAY(Sousitem.dateCreation)) as count'])
      .where("Sousitem.dateCreation BETWEEN :start AND :end", { start: dateDebut, end: dateFin })
      .groupBy("DAY(Sousitem.dateCreation)")
      .addGroupBy("FORMAT(Sousitem.dateCreation ,'MM')")
      .addGroupBy("YEAR(Sousitem.dateCreation)")
    try {
      sousItemCreate = await resultSiCreation.getRawMany();
    } catch (e) {
      return {
        status: HttpStatus.CONFLICT,
        error: "Problème lié à la récupération des sous items créés",
      }
    }

    const resultSiModify = this.SousItemSaveRepo.createQueryBuilder("Sousitemsave")
    .select(["CONCAT(DAY(Sousitemsave.date), '-', FORMAT(Sousitemsave.date, 'MM'), '-', YEAR(Sousitemsave.date)) as date", 'COUNT(DAY(Sousitemsave.date)) as count'])
    .where("Sousitemsave.date BETWEEN :start AND :end", { start: dateDebut, end: dateFin })
    .andWhere("Sousitemsave.status = 'M'")
    .groupBy("DAY(Sousitemsave.date)")
    .addGroupBy("FORMAT(Sousitemsave.date, 'MM')")
    .addGroupBy("YEAR(Sousitemsave.date)")
    try {
      sousItemModify = await resultSiModify.getRawMany();
    } catch (e) {
      return {
        status: HttpStatus.CONFLICT,
        error:  "Problème lié à la récupération des sous items modifiés",
      }
    }

    const resultSisaveDelete = this.SousItemSaveRepo.createQueryBuilder("Sousitemsave")
      .select(["CONCAT(DAY(Sousitemsave.date), '-', FORMAT(Sousitemsave.date, 'MM'), '-', YEAR(Sousitemsave.date)) as date", 'COUNT(DAY(Sousitemsave.date)) as count'])
      .where("Sousitemsave.date BETWEEN :start AND :end", { start: dateDebut, end: dateFin })
      .andWhere("Sousitemsave.status = 'D'")
      .groupBy("DAY(Sousitemsave.date)")
      .addGroupBy("FORMAT(Sousitemsave.date, 'MM')")
      .addGroupBy("YEAR(Sousitemsave.date)")
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
        allInfoPerMonth.objectCreated[index].count = allInfoPerMonth.objectCreated[index].count + siC.count
      } else {
        allInfoPerMonth.objectCreated.push(siC);
      }
    }

    for (const siM of sousItemModify) {
      let index = allInfoPerMonth.objectModified.findIndex((element) => element.date == siM.date)
      if (index != -1) {
        allInfoPerMonth.objectModified[index].count = allInfoPerMonth.objectModified[index].count + siM.count
      } else {
        allInfoPerMonth.objectModified.push(siM);
      }
    }

    for (const siD of sousItemDelete) {
      let index = allInfoPerMonth.objectDeleted.findIndex((element) => element.date == siD.date)
      if (index != -1) {
        allInfoPerMonth.objectDeleted[index].count = allInfoPerMonth.objectDeleted[index].count + siD.count
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

    // let OrModify = await this.OrSaveRepo.find({
    //   select
    //   where : {
    //     date : Between(dateDebut,dateFin),
    //     status : 'M'
    //   }
    // })

    // let ItemModify = await this.itemSaveRepo.find({
    //   where : {
    //     dateCreation : Between(dateDebut, dateFin),
    //     status : 'M'
    //   }
    // })

    // let SiModify = await this.SousItemSaveRepo.find({
    //   where : {
    //     dateCreation : Between(dateDebut, dateFin),
    //     status : 'M'
    //   }
    // })





    return InfoPerDay;
    
    
  }



  findAll() {
    return `This action returns all serviceAccueil`;
  }

  findOne(id: number) {
    return `This action returns a #${id} serviceAccueil`;
  }

}
