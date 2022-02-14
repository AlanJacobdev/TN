import { IsNotEmpty } from "class-validator";

export class UpdateDroitparserviceDto {
    @IsNotEmpty()
    idDroit : string;

    @IsNotEmpty()
    idService : string;

    @IsNotEmpty()
    valeur : boolean;
    
    @IsNotEmpty()
    profilModification : string;

    posteModification : string;
    
    dateModification : Date;
    
}

