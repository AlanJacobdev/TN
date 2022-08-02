import { Allow, IsNotEmpty } from 'class-validator';

/**
 * Structure de données attendue pour la modification d'un Atelier
 * @IsNotEmpty() => Données obligatoire (Erreur si absente)
 * @Allow() => Données facultatives
 * Aucun Decorateur => Données non attendue mais complétées ultérieurement
 */

export class UpdateAtelierDto {

    @Allow()
    codeGMAO : string;

    @Allow()
    actif : boolean;
    
    @Allow()
    libelleAtelier : string;

    @IsNotEmpty()
    profilModification : string;

    @Allow()
    posteModification : string;

    dateModification : Date;
       
}
