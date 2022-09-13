import { IsNotEmpty } from "class-validator";

/**
 * Structure de données attendue pour la création d'une exportation
 * @IsNotEmpty() => Données obligatoire (Erreur si absente)
 * @Allow() => Données facultatives
 * Aucun Decorateur => Données non attendue mais complétées ultérieurement
 */
export class CreateExportationDto {

    @IsNotEmpty()
    nomDocument : string;

    @IsNotEmpty()
    path : string

    @IsNotEmpty()
    date : Date

    @IsNotEmpty()
    profil : string
    
}
