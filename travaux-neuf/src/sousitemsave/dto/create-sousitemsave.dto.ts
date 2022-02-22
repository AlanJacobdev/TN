import { Allow, IsNotEmpty } from "class-validator";
import { Sousitem } from "src/sousitem/entities/sousitem.entity";

export class CreateSousitemsaveDto {
    
    @IsNotEmpty()
    idSousItem : string;
    
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
    
    @Allow()
    description: string;

    @IsNotEmpty()
    etat: string;

    @Allow()
    profilModification : string;

    @Allow()
    posteModification : string;

}
