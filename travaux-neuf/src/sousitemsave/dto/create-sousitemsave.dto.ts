import { Allow, IsNotEmpty } from "class-validator";
import { Description } from "src/description/entities/description.entity";
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
    description: Description[];

    @IsNotEmpty()
    etat: string;

    @Allow()
    profilModification : string;

    @Allow()
    posteModification : string;

}
