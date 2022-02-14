import { IsNotEmpty } from "class-validator";


export class UpdateDroitparutilisateurDto {

   
    @IsNotEmpty()
    idUtilisateur : number;

    @IsNotEmpty()
    idDroit : string;

    @IsNotEmpty()
    valeur : boolean;
    
    posteModification : string;
    
    dateModification : Date;
}
