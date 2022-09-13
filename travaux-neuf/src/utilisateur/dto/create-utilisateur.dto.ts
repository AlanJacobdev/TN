import { Allow, isNotEmpty, IsNotEmpty } from "class-validator";

/**
 * Structure de données attendue pour la création d'un Utilisateur
 * @IsNotEmpty() => Données obligatoire (Erreur si absente)
 * @Allow() => Données facultatives
 * Aucun Decorateur => Données non attendue mais complétées ultérieurement
 */

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
