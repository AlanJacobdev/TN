import { HttpStatus, Injectable } from '@nestjs/common';
import { ItemService } from 'src/item/item.service';
import { CreateItemsaveDto } from 'src/itemsave/dto/create-itemsave.dto';
import { ItemsaveService } from 'src/itemsave/itemsave.service';
import { ObjetrepereService } from 'src/objetrepere/objetrepere.service';
import { ParametreService } from 'src/parametre/parametre.service';
import { SousitemService } from 'src/sousitem/sousitem.service';
import { CreateSousitemsaveDto } from 'src/sousitemsave/dto/create-sousitemsave.dto';
import { SousitemsaveService } from 'src/sousitemsave/sousitemsave.service';
import { deleteObject } from './interface/SuppressionInterface';

/**
 * @author : @alanjacobdev
 * Classe appellée par un controleur. 
 * Manipule des données afin de les renvoyer au controleur après traitement
 */

@Injectable()
export class ServiceSuppressionService {
 
  constructor(private ORService : ObjetrepereService ,private ItemService : ItemService, private SIService : SousitemService, private paramService : ParametreService,
              private ItemSaveService : ItemsaveService, private SISaveService : SousitemsaveService,){}
 
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
        
        if (ITEM.profilCreation != profil) {
          return false;
        }
        if(ITEM.dateCreation.getTime() < dateNow.getTime()) {
          return false;
        }

        const listeSiOfItem = await this.SIService.getSousItemByItem(ITEM.idItem);
        
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
    
    if (canDeleteAsAdmin) {
      return await this.deleteObject(profil, objectToDelete, true);
    } else {    
    return await this.deleteObject(profil, objectToDelete, false);
    }
  }


  async deleteObject (profil:string, objectToDelete : deleteObject, admin : boolean, date? :Date) {
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
        if (date){
          await this.deleteSI(listeSousItem, admin, profil, date);
        } else {
          await this.deleteSI(listeSousItem, admin, profil);
        }
        
      }
      if(listeItem.length != 0) {
        if (date){
          await this.deleteItem(listeItem, admin,profil,date);
        } else {
          await this.deleteItem(listeItem, admin,profil);
        }
       
      } 
      if(listeOR.length != 0) {
        if (date){
          await this.deleteOR(listeOR, admin, profil, date);
        } else {
          await this.deleteOR(listeOR, admin,profil);
        }
        
      }
    
    retour = {
      listeOR : this.retourOR,
      listeItem : this.retourItem,
      listeSI : this.retourSI
    };
    return retour;
    } catch (e:any) {
      console.log(e);
      return {
        status : HttpStatus.NOT_FOUND,
        error : 'Problème lors de la supression' + e
      }
    }
  }


  async deleteSI(listeSousItem : string[], admin : boolean, profil : string, date? : Date){
    for (const SI of listeSousItem){
      let res 
      if(date) {
        res = await this.SIService.remove(SI, profil, admin, date);
      } else {
        res = await this.SIService.remove(SI, profil, admin);
      }

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

  async deleteItem(listeItem : string [], admin : boolean, profil : string, date? : Date){
    
      let flagErrorSI : boolean = false;
      for(const Item of listeItem){
        flagErrorSI= false;
        const listeSiOfItem = await this.SIService.getSousItemByItem(Item);
        if(listeSiOfItem.length != 0){
          if(admin){
            for (const SI of listeSiOfItem){
              let res 
              if(date) {
                res = await this.SIService.remove(SI.idSousItem, profil, admin, date);
              } else {
                res = await this.SIService.remove(SI.idSousItem, profil, admin);
              }
             
              if (!res.hasOwnProperty('message')){
                flagErrorSI = true;
              }
            }
          } else {
            flagErrorSI = true;
          }
        }
        
        if(!flagErrorSI){
          let res 
          if(date) {
            res = await this.ItemService.remove(Item, profil, admin, date);
          } else {
            res = await this.ItemService.remove(Item, profil, admin);
          }
          
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

  async deleteOR(listeOR : string [], admin : boolean, profil : string, date? : Date){

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
                  let res 
                  if(date) {
                    res = await this.SIService.remove(SI.idSousItem, profil, admin, date);
                  } else {
                    res = await this.SIService.remove(SI.idSousItem, profil, admin);
                  }
                  if (!res.hasOwnProperty('message')){
                    flagErrorSI = true;
                  }
                }
              } 
              if(!flagErrorSI){
                let res 
                if(date) {
                  res = await this.ItemService.remove(Item.idItem, profil, admin, date);
                } else {
                  res = await this.ItemService.remove(Item.idItem, profil, admin);
                }
                
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
          let res 
          if(date) {
            res = await this.ORService.remove(OR, profil, admin, date);
          } else {
            res = await this.ORService.remove(OR, profil, admin);
          }
          
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
    

    async createObjectSaveForDemandeAdminRefuse(profil:string, objectToDelete : deleteObject, date :Date){
      const listeOR : string[] = objectToDelete.listeOR;
      const listeItem : string[] = objectToDelete.listeItem;
      const listeSousItem : string[] = objectToDelete.listeSI;
    
      try {
      
        if(listeSousItem.length != 0) {
          if (date){
            await this.SIService.createSIForDemandeRefuse(listeSousItem, profil, date);
          }
          
        }
        if(listeItem.length != 0) {
          if (date){
            await this.ItemService.createItemForDemandeRefuse(listeItem, profil, date);
            for (const item of listeItem) {
              let siList = await this.SIService.getSousItemByItem(item)
              if ( siList.length != 0) {
                for (const si of siList) {
                  let createSousitemsaveDto: CreateSousitemsaveDto = {
                    idSousItem: si.idSousItem,
                    libelleSousItem: si.libelleSousItem,
                    idItem: si.idItem,
                    codeSousItem: si.codeSousItem,
                    securite: si.securite,
                    estPrefixe: si.estPrefixe,
                    etat: si.etat,
                    date: date,
                    description: si.description,
                    status: 'DAR',
                    profilModification: profil,
                    posteModification: ''
                  }
                  await this.SISaveService.create(createSousitemsaveDto)
                }
              }
            }
          }
        
        } 
        if(listeOR.length != 0) {
          if (date){
            await this.ORService.createORForDemandeRefuse(listeOR, profil, date);

            for (const or of listeOR){
              let itemList = await this.ItemService.getItemByOR(or);              
              if ( itemList.length != 0) {
                for (const item of itemList) {
                  let createItemsaveDto : CreateItemsaveDto= {
                    idItem: item.idItem,
                    libelleItem: item.libelleItem,
                    idOR: item.idOR,
                    numeroUnique: item.numeroUnique,
                    digit: item.digit,
                    codeObjet: item.codeObjet,
                    securite: item.securite,
                    etat: item.etat,
                    date: date,
                    description: item.description,
                    status: 'DAR',
                    profilModification: profil,
                    posteModification: ''
                  } 
                  await this.ItemSaveService.create(createItemsaveDto)
                  let siList = await this.SIService.getSousItemByItem(item.idItem)
                  
                  if ( siList.length != 0) {
                    for (const si of siList) {
                      let createSousitemsaveDto: CreateSousitemsaveDto = {
                        idSousItem: si.idSousItem,
                        libelleSousItem: si.libelleSousItem,
                        idItem: si.idItem,
                        codeSousItem: si.codeSousItem,
                        securite: si.securite,
                        estPrefixe: si.estPrefixe,
                        etat: si.etat,
                        date: date,
                        description: si.description,
                        status: 'DAR',
                        profilModification: profil,
                        posteModification: ''
                      }
                      await this.SISaveService.create(createSousitemsaveDto)
                    }
                  }
                }
              }
            }
          } 
          
        }
      
        return {
          status : HttpStatus.ACCEPTED,
          message : 'Création effectuée' 
        }
      } catch (e:any) {
        console.log(e);
        return {
          status : HttpStatus.NOT_FOUND,
          error : 'Problème lors de la supression' + e
        }
      }
    }


}
