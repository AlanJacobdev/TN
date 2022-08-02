import { IsNotEmpty } from "class-validator"

/**
 * Structure de données attendue pour la création d'un document
 * @IsNotEmpty() => Données obligatoire (Erreur si absente)
 * @Allow() => Données facultatives
 * Aucun Decorateur => Données non attendue mais complétées ultérieurement
 */

export class CreateDocumentDto {

    @IsNotEmpty()
    idDocument : string
    
    @IsNotEmpty()
    nomDocument : string

    @IsNotEmpty()
    path : string

    @IsNotEmpty()
    type:string; 
    
    @IsNotEmpty()
    date : Date;

    @IsNotEmpty()
    profil : string;

    libelleDocument: string;
}
