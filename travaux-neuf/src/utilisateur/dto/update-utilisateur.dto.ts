import { Allow, IsNotEmpty } from "class-validator";

export class UpdateUtilisateurDto {

        
 

    @IsNotEmpty()
    nom : string;

    @IsNotEmpty()
    prenom : string;

    @IsNotEmpty()
    idService : string;

    @IsNotEmpty()
    estAdministrateur : boolean;
    
    @IsNotEmpty()
    profilModification : string;

    @Allow()
    posteModification : string;
    
    dateModification : Date;

}
