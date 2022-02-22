import { Allow, IsNotEmpty } from "class-validator";

export class CreateDroitparutilisateurDto {

    @IsNotEmpty()
    idUtilisateur : number;

    @IsNotEmpty()
    idDroit : string;

    @IsNotEmpty()
    valeur : boolean;

    @IsNotEmpty()
    profilCreation : string;

    @Allow()
    posteCreation : string;
    
    dateCreation : Date;
}
