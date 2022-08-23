import { Allow, IsNotEmpty } from "class-validator";
import { Description } from "src/description/entities/description.entity";

/**
 * Structure de données attendue pour la création d'un objet repère sauvegardé
 * @IsNotEmpty() => Données obligatoire (Erreur si absente)
 * @Allow() => Données facultatives
 * Aucun Decorateur => Données non attendue mais complétées ultérieurement
 */

export class CreateOrsaveDto {
    
    @IsNotEmpty()
    idObjetRepere : string;

    @IsNotEmpty()
    libelleObjetRepere : string;
   
    @IsNotEmpty()
    codeType : string;

    @IsNotEmpty()
    numeroUnique : string;

    @IsNotEmpty()
    etat : string;

    @IsNotEmpty()
    securite : boolean;

    @IsNotEmpty()
    description: Description[];

    @IsNotEmpty()
    status : string;

    @IsNotEmpty()
    date : Date

    @IsNotEmpty()
    profilModification : string;

    @Allow()
    posteModification : string;

}
