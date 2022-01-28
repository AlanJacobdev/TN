import { IsNotEmpty } from "class-validator";

export class UpdateUtilisateurDto {

    @IsNotEmpty()
    idUtilisateur: number;

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

    @IsNotEmpty()
    posteModification : string;
    
    dateModification : Date;

}
