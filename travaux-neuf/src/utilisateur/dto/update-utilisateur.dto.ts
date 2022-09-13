import { Allow, isNotEmpty, IsNotEmpty } from "class-validator";

/*
* Structure de données attendue pour la modification d'un Utilisateur
* @IsNotEmpty() => Données obligatoire (Erreur si absente)
* @Allow() => Données facultatives
* Aucun Decorateur => Données non attendue mais complétées ultérieurement
*/

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
