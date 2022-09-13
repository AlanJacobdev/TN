import { Allow, IsNotEmpty } from "class-validator";


/**
 * Structure de données attendue pour la création d'un paramètre
 * @IsNotEmpty() => Données obligatoire (Erreur si absente)
 * @Allow() => Données facultatives
 * Aucun Decorateur => Données non attendue mais complétées ultérieurement
 */

export class CreateParametreDto {

    @IsNotEmpty()
    libelle : string

    @IsNotEmpty()
    valeur : string
    
    @IsNotEmpty()
    profilCreation : string;

    @Allow()
    posteCreation : string;
    
    dateCreation : Date;

}
