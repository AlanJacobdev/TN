import { Allow, IsNotEmpty } from "class-validator";
import { Atelier } from "src/atelier/entities/atelier.entity";

/**
 * Structure de données attendue pour la création d'un numéro unique
 * @IsNotEmpty() => Données obligatoire (Erreur si absente)
 * @Allow() => Données facultatives
 * Aucun Decorateur => Données non attendue mais complétées ultérieurement
 */

export class CreateNumerouniqueDto {

    @IsNotEmpty()
    idNumeroUnique : string;

    @IsNotEmpty()
    idAtelier : Atelier;
    
    @IsNotEmpty()
    numeroObjet : string

    @IsNotEmpty()
    profilCreation : string;

    @Allow()
    posteCreation : string;
    
    dateCreation : Date;
    
}
