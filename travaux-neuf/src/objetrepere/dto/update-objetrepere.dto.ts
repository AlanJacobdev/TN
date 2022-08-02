import { Allow, IsNotEmpty } from "class-validator";
import { Description } from "src/description/entities/description.entity";

/**
 * Structure de données attendue pour la modification d'un objet repère
 * @IsNotEmpty() => Données obligatoire (Erreur si absente)
 * @Allow() => Données facultatives
 * Aucun Decorateur => Données non attendue mais complétées ultérieurement
 */

export class UpdateObjetrepereDto {

  
    @IsNotEmpty()
    libelleObjetRepere : string;

    @IsNotEmpty()
    etat : string;

    @Allow()
    description : Description[];

    @IsNotEmpty()
    profilModification : string;
    
    @Allow()
    posteModification : string;
    
    dateModification : Date;

}
