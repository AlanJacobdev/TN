import { Allow, IsNotEmpty } from "class-validator";


/**
 * Structure de données attendue pour la création d'un Type d'objet repère
 * @IsNotEmpty() => Données obligatoire (Erreur si absente)
 * @Allow() => Données facultatives
 * Aucun Decorateur => Données non attendue mais complétées ultérieurement
 */

export class CreateTypeobjetrepereDto {

    @IsNotEmpty()
    idTypeOR : string;

    @IsNotEmpty()
    libelleTypeOR : string;
   
    @IsNotEmpty()
    profilCreation : string;

    @IsNotEmpty()
    actif : boolean;

    @Allow()
    posteCreation : string;

    dateCreation : Date;

}