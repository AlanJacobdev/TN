import { Allow, IsNotEmpty } from "class-validator";

/**
 * Structure de données attendue pour la création d'un Type d'objet repère
 * @IsNotEmpty() => Données obligatoire (Erreur si absente)
 * @Allow() => Données facultatives
 * Aucun Decorateur => Données non attendue mais complétées ultérieurement
 */

export class CreateTypeobjetDto {

    @IsNotEmpty()
    idType : string;

    @IsNotEmpty()
    libelleType : string;
   
    @IsNotEmpty()
    actif : boolean;
    
    @IsNotEmpty()
    profilCreation : string;

    @Allow()
    posteCreation : string;

    dateCreation : Date;

    
    
}
