import { Item } from "src/item/entities/item.entity";
import { Objetrepere } from "src/objetrepere/entities/objetrepere.entity";
import { Sousitem } from "src/sousitem/entities/sousitem.entity";

export interface exportGMAO{
    listeOR : Objetrepere[],
    listeItem : Item[],
    listeSI : Sousitem[]
}