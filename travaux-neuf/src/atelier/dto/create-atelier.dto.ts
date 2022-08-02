import { Allow, IsNotEmpty } from "class-validator";

/**
 * Structure de données attendue pour la création d'un Atelier
 * @IsNotEmpty() => Données obligatoire (Erreur si absente)
 * @Allow() => Données facultatives
 * Aucun Decorateur => Données non attendue mais complétées ultérieurement
 */

export class CreateAtelierDto {
    
    
    @IsNotEmpty()
    idAtelier : string;

    @IsNotEmpty()
    libelleAtelier : string;

    @IsNotEmpty()
    codeGMAO : string;
   
    @IsNotEmpty()
    actif : boolean;

    @IsNotEmpty()
    profilCreation : string;

    @Allow()
    posteCreation : string;
    
    dateCreation : Date;
   
}
