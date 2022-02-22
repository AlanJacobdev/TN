import { Allow, IsNotEmpty } from "class-validator";

export class CreateDroitDto {

    @IsNotEmpty()
    idDroit : string;

    @IsNotEmpty()
    libelleDroit : string;

    @IsNotEmpty()
    profilCreation : string;

    @Allow()
    posteCreation : string;
    
    dateCreation : Date;

}
