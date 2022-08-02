import { IsNotEmpty, Allow } from 'class-validator';

/**
 * Structure de données attendue pour la modification d'une information
 * @IsNotEmpty() => Données obligatoire (Erreur si absente)
 * @Allow() => Données facultatives
 * Aucun Decorateur => Données non attendue mais complétées ultérieurement
 */

export class UpdateInformationDto {

    @IsNotEmpty()
    text : string

    @Allow()
    document : Document[];

    @Allow()
    idDocument : number[];

    @IsNotEmpty()
    profilModification : string

    dateModification : Date
}

