import { Allow, IsNotEmpty } from "class-validator";

export class UpdateDroitparserviceDto {

    @IsNotEmpty()
    valeur : boolean;
    
    @IsNotEmpty()
    profilModification : string;

    @Allow()
    posteModification : string;
    
    dateModification : Date;
    
}

