import { IsNotEmpty } from "class-validator";
import { Sousitem } from "src/sousitem/entities/sousitem.entity";

export class CreateSousitemsaveDto {
    
    @IsNotEmpty()
    idSousItem : Sousitem;
    
    @IsNotEmpty()
    libelleSousItem: string;
    
    @IsNotEmpty()
    idItem: string;
    
    @IsNotEmpty()
    codeSousItem: string;
    
    @IsNotEmpty()
    securite : boolean;
    
    @IsNotEmpty()
    estPrefixe: boolean;
    
    @IsNotEmpty()
    actif: boolean;
    
    @IsNotEmpty()
    date : Date

    @IsNotEmpty()
    heure : Date;
    
    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    etat: string;

}
