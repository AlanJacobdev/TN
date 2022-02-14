import { IsNotEmpty } from "class-validator";

export class CreateDroitDto {

    @IsNotEmpty()
    idDroit : string;

    @IsNotEmpty()
    libelleDroit : string;

    @IsNotEmpty()
    profilCreation : string;

    @IsNotEmpty()
    posteCreation : string;
    
    dateCreation : Date;

}
