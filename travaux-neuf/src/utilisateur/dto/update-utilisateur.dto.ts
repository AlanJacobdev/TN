import { Allow, isNotEmpty, IsNotEmpty } from "class-validator";

export class UpdateUtilisateurDto {

    @Allow()
    nom : string;

    @Allow()
    prenom : string;

    @Allow()
    password : string

    @Allow()
    email: string;

    @Allow()
    idRole : number;

    @Allow()
    estAdministrateur : boolean;
    
    @IsNotEmpty()
    profilModification : string;

    @Allow()
    posteModification : string;
    
    @Allow()
    estActif : boolean

    dateModification : Date;

}
