import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateItemDto } from 'src/item/dto/create-item.dto';
import { ItemService } from 'src/item/item.service';
import { ObjetrepereService } from 'src/objetrepere/objetrepere.service';
import { SousitemService } from 'src/sousitem/sousitem.service';
import { ConfigService } from '@nestjs/config';
import { CreateSousitemDto } from 'src/sousitem/dto/create-sousitem.dto';
import { recopieItem } from './interface/RecopieInterface';

/**
 * @author : @alanjacobdev
 * Classe appellée par un controleur. 
 * Manipule des données afin de les renvoyer au controleur après traitement
 */

@Injectable()
export class ServiceRecopieService {


    constructor(private OrService : ObjetrepereService, private itemService:ItemService,
                private SiService : SousitemService, private configservice : ConfigService){}


    /**
     * Recopie l'ensemble des items d'un objet sur un autre objet 
     * @param or Identifiant de l'objet parent source
     * @param nu Numéro unique de l'objet parent cible
     * @returns Liste des items du parent cible
     */
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
                                etat : item.etat,
                                description : item.description,
                                profilCreation : this.configservice.get('profil') ,
                                dateCreation : new Date(),
                                posteCreation : "",
                                exporte: false
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

    /**
     * Recopie l'ensemble des sous items d'un item sur un autre item 
     * @param item Identifiant de l'item parent source
     * @param nu Numéro unique de l'item parent cible
     * @param profil : Identifiant du profil à l'origine de la requête
     * @returns Liste des sous items du parent cible
     */
    async recopySousItemFromItem(item: string, nu : string, profil : string ) {
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
                                libelleSousItem : sousItem.libelleSousItem.replace(sousItem.idItem, sousItem.idItem.substring(0,2)+ nu),
                                idItem : idTargetItem,
                                codeSousItem : sousItem.codeSousItem,
                                securite : sousItem.securite,
                                estPrefixe : sousItem.estPrefixe,
                                etat : sousItem.etat,
                                description : sousItem.description,
                                profilCreation : profil,
                                posteCreation : "",
                                dateCreation : new Date(),
                                exporte : false
                            }
                            await this.SiService.create(createsousitem);
                        }
                    }
                    return await this.SiService.findAllSousItemOfItem(idTargetItem);
                } else {
                    return  {
                        status : HttpStatus.NOT_FOUND,
                        message :'Source Item hasn\'t sousItems'
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

    /**
     * Recopie un item lié à un objet repère
     * @param IdOR : Identifiant de l'objet repère
     * @param IdItem : Identifiant de l'item
     * @param nu : Numéro unique cible
     * @param profil : Identifiant du profil cible
     * @returns Structure du nouvel item ou erreur
     */
    async recopyOneItemFromOR(IdOR: string, IdItem: string, nu:string, profil : string){
        
        const orSourceExist = await this.OrService.findOne(IdOR);
        if (orSourceExist != undefined) {
            const orTargetExist = await this.OrService.findOne(orSourceExist.codeType + nu);
            if (orTargetExist != undefined) {
                const item = await this.itemService.findOne(IdItem);
                if(item != undefined){ 
                    const idTargetItem = (item.securite ? item.codeObjet + nu + item.digit + 'Z' : item.codeObjet + nu + item.digit)
                    let createitem = new CreateItemDto();
                    createitem = {
                        idItem : idTargetItem ,
                        libelleItem :  item.libelleItem.replace(item.idOR, item.idOR.substring(0,2)+ nu),
                        idOR : orSourceExist.codeType + nu,
                        numeroUnique : nu,
                        digit : item.digit,
                        codeObjet : item.codeObjet,
                        securite : item.securite,
                        etat : item.etat,
                        description : item.description,
                        profilCreation : profil,
                        dateCreation : new Date(),
                        posteCreation : "",
                        exporte: false
                    }
                    return await this.itemService.create(createitem);
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


    /**
     * Recopie une liste d'item lié à un objet repère
     * @param idOr : Identifiant de l'objet repère source
     * @param NU : Numéro unique cible
     * @param itemsRecopie : Liste d'item a recopier
     * @param profil : Identifiant de l'utilisateur à l'origine de la requête
     * @returns Message de validation ou erreur
     */

    async recopySpecificItemFromOR(idOr:string, NU:string, itemsRecopie: recopieItem[], profil : string) {
        let retour : string = "";

        for ( const item of itemsRecopie){
            const existItem = await this.itemService.findOne(item.idItem);
            if (existItem != undefined){ 
                const idTargetItemSec = item.codeObjet + NU + item.idItem.charAt(6) + 'Z' ;
                const idTargetItem =  item.codeObjet + NU + item.idItem.charAt(6);
                const itemExist = await this.itemService.findOne(idTargetItem);
                const itemExistSec = await this.itemService.findOne(idTargetItemSec);
                if (itemExist != undefined || itemExistSec != undefined){
                    return {
                        status : HttpStatus.NOT_FOUND,
                        error :'Impossible de recopier un item déjà existant' 
                    }
                } 
            } else {
                return {
                    status : HttpStatus.NOT_FOUND,
                    error :'Item inconnu' 
                }
            }
        }

        for(const item of itemsRecopie){
            const recopieItem = await this.recopyOneItemFromOR(idOr, item.idItem, NU, profil);
            
           
            const SI = await this.recopySousItemFromItem(item.idItem, NU, profil);
            
           
        }
    
       
            retour = JSON.stringify(
                { 
                    status : HttpStatus.OK, 
                    message :'Les items ont été recopiés' 
                }
            )
        
        
        return retour;
    }




}
