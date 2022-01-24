import { IsNotEmpty } from "class-validator";

export class CreateDroitparserviceDto {
    
    @IsNotEmpty()
    idDroit : string;

    @IsNotEmpty()
    idService : string;

    @IsNotEmpty()
    valeur : boolean;

}
