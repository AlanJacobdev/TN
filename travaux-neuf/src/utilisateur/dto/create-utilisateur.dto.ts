import { Allow, IsNotEmpty } from "class-validator";

export class CreateUtilisateurDto {
    
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

    @Allow()
    posteCreation : string;
    
    dateCreation : Date;

}
