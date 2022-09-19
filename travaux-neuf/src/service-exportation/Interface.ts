import { Item } from "src/item/entities/item.entity";
import { Objetrepere } from "src/objetrepere/entities/objetrepere.entity";
import { Sousitem } from "src/sousitem/entities/sousitem.entity";

/**
 * Interfaces utiles au sein du service exportation
 */

export interface exportGMAO{
    listeOR : Objetrepere[],
    listeItem : Item[],
    listeSI : Sousitem[],
    profilCreation : string,
    nomDocument : string

}

export interface createExportGMAO{

    createObject :  {
                    listeOR : Objetrepere[],
                    listeItem : Item[],
                    listeSI : Sousitem[],
                    },
    updateObject :  {
                    listeOR : Objetrepere[],
                    listeItem : Item[],
                    listeSI : Sousitem[],
                    },
    user : string,
    nomDocument :string
    }