import { IsNotEmpty } from "class-validator"

/**
 * Structure de données attendue pour la modification d'un document
 * @IsNotEmpty() => Données obligatoire (Erreur si absente)
 * @Allow() => Données facultatives
 * Aucun Decorateur => Données non attendue mais complétées ultérieurement
 */

export class UpdateDocumentDto {

    @IsNotEmpty()
    idDocument : number
    
    @IsNotEmpty()
    libelleDocument : string

}
