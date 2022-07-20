import { Injectable } from '@nestjs/common';
import { ItemService } from 'src/item/item.service';
import { ObjetrepereService } from 'src/objetrepere/objetrepere.service';
import { ParametreService } from 'src/parametre/parametre.service';
import { SousitemService } from 'src/sousitem/sousitem.service';
import { deleteObject } from './interface/SuppressionInterface';

@Injectable()
export class ServiceSuppressionService {
 
  constructor(private ORService : ObjetrepereService ,private ItemService : ItemService, private SIService : SousitemService, private paramService : ParametreService){}
 
  private retourSI = [];
  private retourItem = [];
  private retourOR = [];


  async verifyIfCanDeleteTree(profil:string, objectToDelete : deleteObject){
    let OrCanDeleted: boolean, ItemCanDeleted: boolean, SiCanDeleted : boolean;
    let heure = (await this.paramService.findOne("nbHeure")).valeur;
  
    try {
      if(objectToDelete.listeOR.length != 0) {
        OrCanDeleted= await this.verifyOr(profil, objectToDelete.listeOR, Number(heure));
        if(!OrCanDeleted) {
          return false;
        }
      }   
      if(objectToDelete.listeItem.length != 0 ) {
        ItemCanDeleted = await this.verifyItem(profil,objectToDelete.listeItem, Number(heure));
        if(!ItemCanDeleted) {
          return false;
        }
      }
      if(objectToDelete.listeSI.length != 0) {
        SiCanDeleted = await this.verifySi(profil,objectToDelete.listeSI, Number(heure));
        if(!SiCanDeleted) {
          return false;
        }
      }
      return true;
    } catch (e :any) {
      console.log(e);
    }
  }

  async verifyOr(profil:string, Or : string[], heure : number){
    let dateNow = new Date();
    console.log(dateNow);
    
    dateNow.setHours(dateNow.getHours() - heure)
 
    for(const or of Or){
      let OR = await this.ORService.findOne(or);
      if(OR != undefined){
        if (OR.profilCreation != profil) {
          return false;
        }
        
        if(OR.dateCreation.getTime() < dateNow.getTime()) {
          return false;
        }

        const listeItemOfOR = await this.ItemService.getItemByOR(or);
        if (listeItemOfOR.length != 0) {
          for (const Item of listeItemOfOR){
            if (Item.profilCreation != profil) {
              return false;
            }
            if(Item.dateCreation.getTime() < dateNow.getTime()) {
              return false;
            }
            const listeSiOfItem = await this.SIService.getSousItemByItem(Item.idItem);
            if(listeSiOfItem.length != 0){
              for (const SI of listeSiOfItem){
                if (SI.profilCreation != profil) {
                  return false;
                }
                if(SI.dateCreation.getTime() < dateNow.getTime()) {
                  return false;
                }
              }
            }
          }
        }
      } else {
        return false;
      }
    }
    return true;
  }

  async verifyItem(profil:string, Item : string[], heure : number){
    let dateNow = new Date();
    dateNow.setHours(dateNow.getHours() - heure)


    for(const item of Item){
      let ITEM = await this.ItemService.findOne(item);
      if (ITEM != undefined){
        
        console.log(ITEM);
        console.log(item);
        if (ITEM.profilCreation != profil) {
          return false;
        }
        if(ITEM.dateCreation.getTime() < dateNow.getTime()) {
          return false;
        }

        const listeSiOfItem = await this.SIService.getSousItemByItem(ITEM.idItem);
        console.log(listeSiOfItem);
        
        if(listeSiOfItem.length != 0){
          for (const SI of listeSiOfItem){
            if (SI.profilCreation != profil) {
              return false;
            }
            if(SI.dateCreation.getTime() < dateNow.getTime()) {
              return false;
            }
          }
        }
      } else {
        return false;
      }
    }
    return true;
  }

  async verifySi(profil:string, Si : string[], heure : number){
    let dateNow = new Date();
    dateNow.setHours(dateNow.getHours() - heure)
    for(const si of Si){
      console.log(si);
      
      let SI = await this.SIService.findOne(si);
      if (SI != undefined) {
        if (SI.profilCreation != profil) {
          return false;
        }
        if(SI.dateCreation.getTime() < dateNow.getTime()) {
          return false;
        }
      } else {
        return false
      }
    }
    return true;
  }



  async deleteObjectsAsAdmin(profil:string, objectToDelete : deleteObject) {
    return await this.deleteObject(profil, objectToDelete, true);
  }

  async deleteObjects( profil:string, objectToDelete : deleteObject) {
    
    const canDeleteAsAdmin = await this.verifyIfCanDeleteTree (profil, objectToDelete);
    console.log("candelete" + canDeleteAsAdmin);
    
    if (canDeleteAsAdmin) {
      return await this.deleteObject(profil, objectToDelete, true);
    } else {    
    return await this.deleteObject(profil, objectToDelete, false);
    }
  }


  async deleteObject (profil:string, objectToDelete : deleteObject, admin : boolean) {
    let retour : deleteObject = {
      listeOR: [],
      listeItem: [],
      listeSI: []
    };
    this.retourSI = [];
    this.retourItem = [];
    this.retourOR = [];
    const listeOR : string[] = objectToDelete.listeOR;
    const listeItem : string[] = objectToDelete.listeItem;
    const listeSousItem : string[] = objectToDelete.listeSI;
   
    try {
    
      if(listeSousItem.length != 0) {
        await this.deleteSI(listeSousItem, admin,profil);
      }
      if(listeItem.length != 0) {
        await this.deleteItem(listeItem, admin,profil);
      } 
      if(listeOR.length != 0) {
        await this.deleteOR(listeOR, admin,profil);
      }
    
    retour = {
      listeOR : this.retourOR,
      listeItem : this.retourItem,
      listeSI : this.retourSI
    };
    return retour;
    } catch (e:any) {
      console.log(e);
    }
  }


  async deleteSI(listeSousItem : string[], admin : boolean, profil : string){
    for (const SI of listeSousItem){
      const res = await this.SIService.remove(SI,profil, admin);
          
      if (res.hasOwnProperty('message')){
        this.retourSI.push({
          "objet" : SI,
          "value" : true
        });
      } else {
        this.retourSI.push({
          "objet" : SI,
          "value" : false
        });
      }
    }
  }

  async deleteItem(listeItem : string [], admin : boolean, profil : string){
    
      let flagErrorSI : boolean = false;
      for(const Item of listeItem){
        flagErrorSI= false;
        const listeSiOfItem = await this.SIService.getSousItemByItem(Item);
        if(listeSiOfItem.length != 0){
          if(admin){
            for (const SI of listeSiOfItem){
              const res = await this.SIService.remove(SI.idSousItem, profil, admin);
              if (!res.hasOwnProperty('message')){
                flagErrorSI = true;
              }
            }
          } else {
            flagErrorSI = true;
          }
        }
        
        if(!flagErrorSI){
          const res = await this.ItemService.remove(Item, profil, admin);
          if (res.hasOwnProperty('message')){
            this.retourItem.push({
              "objet" : Item,
              "value" : true
            });
          } else {
            this.retourItem.push({
              "objet" : Item,
              "value" : false
            });
          }
        } else {
          this.retourItem.push({
            "objet" : Item,
            "value" : false
          });
        }
      }
  }

  async deleteOR(listeOR : string [], admin : boolean, profil : string){

      let flagErrorSI : boolean = false;
      let flagErrorItem : boolean = false;

      for(const OR of listeOR){
        const listeItemOfOR = await this.ItemService.getItemByOR(OR);
        if (listeItemOfOR.length != 0){
          if(admin){
            for (const Item of listeItemOfOR){
              flagErrorSI = false;
              const listeSiOfItem = await this.SIService.getSousItemByItem(Item.idItem);
              if(listeSiOfItem.length != 0){
                for (const SI of listeSiOfItem){
                  const res = await this.SIService.remove(SI.idSousItem, profil, admin);
                  if (!res.hasOwnProperty('message')){
                    flagErrorSI = true;
                  }
                }
              } 
              if(!flagErrorSI){
                const res = await this.ItemService.remove(Item.idItem, profil, admin);
                if (!res.hasOwnProperty('message')){
                  flagErrorItem = true;
                } 
              }
            }
          } else {
              flagErrorItem = true
          }
        }
        if (!flagErrorItem){
          const res = await this.ORService.remove(OR, profil, admin);
          if (res.hasOwnProperty('message')){
            this.retourOR.push({
              "objet" : OR,
              "value" : true
            });
          } else {
            this.retourOR.push({
              "objet" : OR,
              "value" : false
            });
          }
        } else {
          this.retourOR.push({
            "objet" : OR,
            "value" : false
          });
        }
      }
    }
    




}
