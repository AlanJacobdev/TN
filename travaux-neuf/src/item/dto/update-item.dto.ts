import { Allow, isNotEmpty, IsNotEmpty } from "class-validator";
import { Description } from "src/description/entities/description.entity";

/**
 * Structure de données attendue pour la modification d'un Item
 * @IsNotEmpty() => Données obligatoire (Erreur si absente)
 * @Allow() => Données facultatives
 * Aucun Decorateur => Données non attendue mais complétées ultérieurement
 */

export class UpdateItemDto {

    @IsNotEmpty()
    libelleItem : string

    @Allow()
    etat : string;

    @Allow()
    description : Description[];
    
    @IsNotEmpty()
    profilModification : string;
    
    dateModification : Date;

    @Allow()
    posteModification : string;

    @Allow()
    exporte : boolean
}
