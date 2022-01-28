import { IsNotEmpty } from "class-validator";

export class CreateUtilisateurDto {
    
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
    profilCreation : string;

    @IsNotEmpty()
    posteCreation : string;
    
    dateCreation : Date;

}
