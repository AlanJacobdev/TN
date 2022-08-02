import { IsNotEmpty } from "class-validator";

/**
 * Structure de données attendue pour la création d'une description
 * @IsNotEmpty() => Données obligatoire (Erreur si absente)
 * @Allow() => Données facultatives
 * Aucun Decorateur => Données non attendue mais complétées ultérieurement
 */

export class CreateDescriptionDto {

    @IsNotEmpty()
    lien : string

}
