import { Allow, IsNotEmpty } from "class-validator";

export class CreateParametreDto {

    @IsNotEmpty()
    libelle : string

    @IsNotEmpty()
    valeur : string
    
    @IsNotEmpty()
    profilCreation : string;

    @Allow()
    posteCreation : string;
    
    dateCreation : Date;

}
