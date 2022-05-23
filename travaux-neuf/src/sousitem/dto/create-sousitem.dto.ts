import { Allow, IsNotEmpty } from "class-validator";
import { Description } from "src/description/entities/description.entity";

export class CreateSousitemDto {

    idSousItem : string;

    @IsNotEmpty()
    libelleSousItem : string;

    @IsNotEmpty()
    idItem : string;

    @IsNotEmpty()
    codeSousItem : string;

    @IsNotEmpty()
    securite : boolean;

    @IsNotEmpty()
    estPrefixe : boolean;

    @IsNotEmpty()
    etat : string;

    @Allow()
    description : Description[];
    
    @IsNotEmpty()
    profilCreation : string;

    @Allow()
    posteCreation : string; 

    dateCreation : Date;

}
