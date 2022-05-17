import { Injectable } from '@nestjs/common';
import { Item } from 'src/item/entities/item.entity';
import { ItemService } from 'src/item/item.service';
import { MailModule } from 'src/mail/mail.module';
import { MailService } from 'src/mail/mail.service';
import { ObjetrepereService } from 'src/objetrepere/objetrepere.service';
import { SousitemService } from 'src/sousitem/sousitem.service';
import { deleteObject } from './interface/SuppressionInterface';

@Injectable()
export class ServiceSuppressionService {
 
  constructor(private ORService : ObjetrepereService ,private ItemService : ItemService,private SIService : SousitemService, private mailService : MailService){}
 
  private profil : string = "";
  private retourSI = [];
  private retourItem = [];
  private retourOR = [];
  private admin : boolean = false;

  async sendMail(){
    await this.mailService.sendUserConfirmation("test","test");
  }


  async deleteObjectsAsAdmin(profil:string, objectToDelete : deleteObject) {
    this.admin = true;
    return await this.deleteObject(profil, objectToDelete);
  }

  async deleteObjects( profil:string, objectToDelete : deleteObject) {
    this.admin = false;
    return await this.deleteObject(profil, objectToDelete);
  }


  async deleteObject (profil:string, objectToDelete : deleteObject) {
    let retour : deleteObject = {
      listeOR: [],
      listeItem: [],
      listeSI: []
    };
    this.retourSI = [];
    this.retourItem = [];
    this.retourOR = [];
    this.profil = profil
    const listeOR : string[] = objectToDelete.listeOR;
    const listeItem : string[] = objectToDelete.listeItem;
    const listeSousItem : string[] = objectToDelete.listeSI;

    if(listeOR.length != 0) {
      await this.deleteSI(listeSousItem);
    }
    if(listeItem.length != 0) {
      await this.deleteItem(listeItem);
    } 
    if(listeItem.length != 0) {
      await this.deleteOR(listeOR);
    }
    retour = {
      listeOR : this.retourOR,
      listeItem : this.retourItem,
      listeSI : this.retourSI
    };
    return retour;
  }


  async deleteSI(listeSousItem : string[]){
    for (const SI of listeSousItem){
      const res = await this.SIService.remove(SI, this.profil, this.admin);
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

  async deleteItem(listeItem : string []){
    
      let flagErrorSI : boolean = false;
      for(const Item of listeItem){
        flagErrorSI= false;
        const listeSiOfItem = await this.SIService.getSousItemByItem(Item);
        if(listeSiOfItem.length != 0){
          if(this.admin){
            for (const SI of listeSiOfItem){
              const res = await this.SIService.remove(SI.idSousItem, this.profil, this.admin);
              if (!res.hasOwnProperty('message')){
                flagErrorSI = true;
              }
            }
          } else {
            flagErrorSI = true;
          }
        }
        
        if(!flagErrorSI){
          const res = await this.ItemService.remove(Item, this.profil, this.admin);
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

  async deleteOR(listeOR : string []){

      let flagErrorSI : boolean = false;
      let flagErrorItem : boolean = false;

      for(const OR of listeOR){
        const listeItemOfOR = await this.ItemService.getItemByOR(OR);
        if (listeItemOfOR.length != 0){
          if(this.admin){
            for (const Item of listeItemOfOR){
              flagErrorSI = false;
              const listeSiOfItem = await this.SIService.getSousItemByItem(Item.idItem);
              if(listeSiOfItem.length != 0){
                for (const SI of listeSiOfItem){
                  const res = await this.SIService.remove(SI.idSousItem, this.profil, this.admin);
                  if (!res.hasOwnProperty('message')){
                    flagErrorSI = true;
                  }
                }
              } 
              if(!flagErrorSI){
                const res = await this.ItemService.remove(Item.idItem, this.profil, this.admin);
                if (!res.hasOwnProperty('message')){
                  flagErrorItem = true;
                } 
              }
              
            }
          } else {
              flagErrorItem = true
          }
          if (!flagErrorItem){
            const res = await this.ORService.remove(OR, this.profil, this.admin);
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




}
