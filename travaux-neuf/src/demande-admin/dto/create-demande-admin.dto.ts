import { Allow, IsNotEmpty } from "class-validator";
import { Item } from "src/item/entities/item.entity";
import { Objetrepere } from "src/objetrepere/entities/objetrepere.entity";
import { Sousitem } from "src/sousitem/entities/sousitem.entity";

export class CreateDemandeAdminDto {

    idDemande : number;

    @Allow()
    motif : string;

    etat : boolean;

    @Allow()
    orDelete : Objetrepere[];
    
    @Allow()
    itemDelete : Item[];

    @Allow()
    sousItemDelete : Sousitem[];

    @IsNotEmpty()
    profilCréation : string;

    dateCreation : Date;
}
