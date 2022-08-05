import { Allow, isNotEmpty, IsNotEmpty } from "class-validator";

export class CreateUtilisateurDto {
    
    idUtilisateur: number;

    @IsNotEmpty()
    nom : string;

    @IsNotEmpty()
    prenom : string;

    @IsNotEmpty()
    password : string

    @IsNotEmpty()
    login : string;

    @IsNotEmpty()
    email :string;

    @IsNotEmpty()
    idRole : number;

    @IsNotEmpty()
    estAdministrateur : boolean;
    
    @IsNotEmpty()
    profilCreation : string;

    @Allow()
    posteCreation : string;
    
    dateCreation : Date;

}
