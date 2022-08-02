import { Allow, isNotEmpty, IsNotEmpty } from "class-validator"
import { Document } from "src/document/entities/document.entity";

/**
 * Structure de données attendue pour la création d'une information
 * @IsNotEmpty() => Données obligatoire (Erreur si absente)
 * @Allow() => Données facultatives
 * Aucun Decorateur => Données non attendue mais complétées ultérieurement
 */

export class CreateInformationDto {

    idInfo : number
    
    @IsNotEmpty()
    titre : string

    @IsNotEmpty()
    text : string

    @Allow()
    document : Document[];

    @Allow()
    idDocument : number[];
    
    @IsNotEmpty()
    profilCreation : string

    dateCreation : Date
    
}
