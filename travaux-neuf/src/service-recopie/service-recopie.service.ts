import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateItemDto } from 'src/item/dto/create-item.dto';
import { ItemService } from 'src/item/item.service';
import { ObjetrepereService } from 'src/objetrepere/objetrepere.service';
import { SousitemService } from 'src/sousitem/sousitem.service';
import { ConfigService } from '@nestjs/config';
import { CreateSousitemDto } from 'src/sousitem/dto/create-sousitem.dto';
import { recopieItem } from './interface/RecopieInterface';


@Injectable()
export class ServiceRecopieService {


    constructor(private OrService : ObjetrepereService, private itemService:ItemService,
                private SiService : SousitemService, private configservice : ConfigService){}

    async recopyItemFromObjetRepere(or: string, nu : string ) {
        const orSourceExist = await this.OrService.findOne(or);
        if (orSourceExist != undefined) {
            const orTargetExist = await this.OrService.findOne(orSourceExist.codeType + nu);
            if (orTargetExist != undefined) {
                const ItemsOfOrOrigin = await this.itemService.findAllItemOfOR(or);
                if(ItemsOfOrOrigin.length != 0){ 
                    for (const item of ItemsOfOrOrigin ){
                        const idTargetItem = (item.securite ? item.codeObjet + nu + item.digit + 'Z' : item.codeObjet + nu + item.digit);
                        const itemExist = await this.itemService.findOne(idTargetItem);
                        if (itemExist == undefined){
                            const idTargetItem = (item.securite ? item.codeObjet + nu + item.digit + 'Z' : item.codeObjet + nu + item.digit)
                            let createitem = new CreateItemDto();
                            createitem = {
                                idItem : idTargetItem ,
                                libelleItem :  `Item issue de la recopie de ${item.idItem}`,
                                idOR : orSourceExist.codeType + nu,
                                numeroUnique : nu,
                                digit : item.digit,
                                codeObjet : item.codeObjet,
                                securite : item.securite,
                                actif : item.actif,
                                description : "",
                                profilCreation : this.configservice.get('profil') ,
                                dateCreation : new Date(),
                                posteCreation : ""
                            }
                            await this.itemService.create(createitem);
                        }
                    }
                    return await this.itemService.findAllItemOfOR(orSourceExist.codeType + nu);
                } else {
                    return  {
                        status : HttpStatus.NOT_FOUND,
                        error :'Source Objet Repere hasn\'t items'
                    }
                }
            } else {
                return  {
                    status : HttpStatus.NOT_FOUND,
                    error :'Origin Objet repere doesn\'t exist'
                }
            }
        } else {
            return  {
                status : HttpStatus.NOT_FOUND,
                error :'Origin Objet repere doesn\'t exist'
            }
        }
    }

    async recopySousItemFromItem(item: string, nu : string ) {
        const itemSourceExist = await this.itemService.findOne(item);
        if (itemSourceExist != undefined) {
            const idTargetItem = (itemSourceExist.securite ? itemSourceExist.codeObjet + nu + itemSourceExist.digit + 'Z' : itemSourceExist.codeObjet + nu + itemSourceExist.digit)
            const itemTargetExist = await this.itemService.findOne(idTargetItem);
            if (itemTargetExist != undefined) {
                const SousItemsOfItemOrigin = await this.SiService.findAllSousItemOfItem(item);
                if(SousItemsOfItemOrigin.length != 0){ 
                    for (const sousItem of SousItemsOfItemOrigin ){
                        const idSousItem = (itemSourceExist.securite ? (sousItem.estPrefixe ? sousItem.codeSousItem + itemSourceExist.codeObjet + nu + itemSourceExist.digit + 'Z' : itemSourceExist.codeObjet + nu + itemSourceExist.digit + sousItem.codeSousItem + 'Z' ): (sousItem.estPrefixe ? sousItem.codeSousItem + itemSourceExist.codeObjet + nu + itemSourceExist.digit : itemSourceExist.codeObjet + nu + itemSourceExist.digit + sousItem.codeSousItem ));
                        const sousItemExist = await this.SiService.findOne(idSousItem)
                        if (sousItemExist == undefined){
                            let createsousitem = new CreateSousitemDto();
                            createsousitem = {
                                idSousItem : idSousItem,
                                libelleSousItem : `SousItem issue de la recopie de ${sousItem.idSousItem}`,
                                idItem : idTargetItem,
                                codeSousItem : sousItem.codeSousItem,
                                securite : sousItem.securite,
                                estPrefixe : sousItem.estPrefixe,
                                actif : sousItem.actif,
                                description : "",
                                profilCreation : this.configservice.get('profil'),
                                posteCreation : "",
                                dateCreation : new Date(),
                            }
                            await this.SiService.create(createsousitem);
                        }
                    }
                    return await this.SiService.findAllSousItemOfItem(idTargetItem);
                } else {
                    return  {
                        status : HttpStatus.NOT_FOUND,
                        error :'Source Item hasn\'t sousItems'
                    }
                }
            } else {
                return  {
                    status : HttpStatus.NOT_FOUND,
                    error :'Item doesn\'t exist'
                }
            }
        } else {
            return  {
                status : HttpStatus.NOT_FOUND,
                error :'Origin Item doesn\'t exist'
            }
        }
    }

    async recopyOneItemFromOR(IdOR: string, IdItem: string, nu:string){
        const orSourceExist = await this.OrService.findOne(IdOR);
        if (orSourceExist != undefined) {
            const orTargetExist = await this.OrService.findOne(orSourceExist.codeType + nu);
            if (orTargetExist != undefined) {
                const item = await this.itemService.findOne(IdItem);
                if(item != undefined){ 
                        const idTargetItem = (item.securite ? item.codeObjet + nu + item.digit + 'Z' : item.codeObjet + nu + item.digit);
                        const itemExist = await this.itemService.findOne(idTargetItem);
                        if (itemExist == undefined){
                            const idTargetItem = (item.securite ? item.codeObjet + nu + item.digit + 'Z' : item.codeObjet + nu + item.digit)
                            let createitem = new CreateItemDto();
                            createitem = {
                                idItem : idTargetItem ,
                                libelleItem :  `Item issue de la recopie de ${item.idItem}`,
                                idOR : orSourceExist.codeType + nu,
                                numeroUnique : nu,
                                digit : item.digit,
                                codeObjet : item.codeObjet,
                                securite : item.securite,
                                actif : item.actif,
                                description : "",
                                profilCreation : this.configservice.get('profil') ,
                                dateCreation : new Date(),
                                posteCreation : ""
                            }
                            return await this.itemService.create(createitem);
                    }
                    return  {
                        status : HttpStatus.NOT_FOUND,
                        error :'L\'item '+ idTargetItem +' existe déjà'
                    }
                } else {
                    return  {
                        status : HttpStatus.NOT_FOUND,
                        error :'Source Item doesn\'t exist'
                    }
                }
            } else {
                return  {
                    status : HttpStatus.NOT_FOUND,
                    error :'Target Objet repere doesn\'t exist'
                }
            }
        } else {
            return  {
                status : HttpStatus.NOT_FOUND,
                error :'Origin Objet repere doesn\'t exist'
            }
        }
    }

    async recopyOneSousItemFromItem(IdItem: string, IdSousItem: string, nu:string){
        const itemSourceExist = await this.itemService.findOne(IdItem);
        if (itemSourceExist != undefined) {
            const idTargetItem = (itemSourceExist.securite ? itemSourceExist.codeObjet + nu + itemSourceExist.digit + 'Z' : itemSourceExist.codeObjet + nu + itemSourceExist.digit)
            const itemTargetExist = await this.itemService.findOne(idTargetItem);
            if (itemTargetExist != undefined) {
                const sousItem = await this.SiService.findOne(IdSousItem);
                if(sousItem != undefined){ 
                    const idSousItem = (itemSourceExist.securite ? (sousItem.estPrefixe ? sousItem.codeSousItem + itemSourceExist.codeObjet + nu + itemSourceExist.digit + 'Z' : itemSourceExist.codeObjet + nu + itemSourceExist.digit + sousItem.codeSousItem + 'Z' ): (sousItem.estPrefixe ? sousItem.codeSousItem + itemSourceExist.codeObjet + nu + itemSourceExist.digit : itemSourceExist.codeObjet + nu + itemSourceExist.digit + sousItem.codeSousItem ));
                    const sousItemExist = await this.SiService.findOne(idSousItem)
                    if (sousItemExist == undefined){
                        let createsousitem = new CreateSousitemDto();
                        createsousitem = {
                            idSousItem : idSousItem,
                            libelleSousItem : `SousItem issue de la recopie de ${sousItem.idSousItem}`,
                            idItem : idTargetItem,
                            codeSousItem : sousItem.codeSousItem,
                            securite : sousItem.securite,
                            estPrefixe : sousItem.estPrefixe,
                            actif : sousItem.actif,
                            description : "",
                            profilCreation : this.configservice.get('profil'),
                            posteCreation : "",
                            dateCreation : new Date(),
                        }
                        await this.SiService.create(createsousitem);
                    }
                    
                    return await this.SiService.findAllSousItemOfItem(idTargetItem);
                } else {
                    return  {
                        status : HttpStatus.NOT_FOUND,
                        error :'Source Item doesn\'t exist'
                    }
                }
            } else {
                return  {
                    status : HttpStatus.NOT_FOUND,
                    error :'Item doesn\'t exist'
                }
            }
        } else {
            return  {
                status : HttpStatus.NOT_FOUND,
                error :'Origin Item doesn\'t exist'
            }
        }
    }

    async recopySpecificItemFromOR(idOr:string, NU:string, itemsRecopie: recopieItem[]) {
        let retour : string = "";
        let error = 0;
        let listIdError = [];
        let stringError : string = "";

        for(const item of itemsRecopie){
            const recopieItem = await this.recopyOneItemFromOR(idOr, item.idItem,NU);
            if(recopieItem.hasOwnProperty('error')){
                error =+ 1 ;
                listIdError.push(item.idItem)
            }
        }
    
        if( error > 0 ){
            listIdError.forEach(function(item, index, array) {
                if(index == 0) {
                    stringError += item
                } else {
                    stringError += ", " + item
                }
              });

            retour = JSON.stringify(
                { 
                    status : HttpStatus.NOT_FOUND, 
                    error :'Les items '+ stringError + ' n\'ont pas pu être créé'
                }
                    )
        } else {
            retour = JSON.stringify(
                { 
                    status : HttpStatus.NOT_FOUND, 
                    message :'Les items ont été recopiés' 
                }
            )
        }
        
        return retour;
    }




}
