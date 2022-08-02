import { Allow, IsNotEmpty, MaxLength } from "class-validator";
import { Description } from "src/description/entities/description.entity";


/**
 * Structure de données attendue pour la création d'un Objet repère
 * @IsNotEmpty() => Données obligatoire (Erreur si absente)
 * @Allow() => Données facultatives
 * Aucun Decorateur => Données non attendue mais complétées ultérieurement
 */

export class CreateObjetrepereDto {

   
    idObjetRepere : string;

    @MaxLength(50, {
        message: 'Libellé trop long (50 caractères)',
    })
    @IsNotEmpty()
    libelleObjetRepere : string;

    @MaxLength(2, {
        message: 'Code Type trop long (2 caractères)',
    })
    @IsNotEmpty()
    codeType : string;
    
    @MaxLength(4, {
        message: 'Numéro unique trop long (4 caractères)',
    })
    @IsNotEmpty()
    numeroUnique : string;

    @IsNotEmpty()
    etat : string;

    @Allow()
    description : Description[];

    @IsNotEmpty()
    profilCreation : string;
    
    @Allow()
    posteCreation : string;
    
    dateCreation : Date;

    @Allow()
    rangeNu : string[]

}
