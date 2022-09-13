import { Allow, IsNotEmpty } from "class-validator";
import { Description } from "src/description/entities/description.entity";

/**
 * Structure de données attendue pour la création d'un Sous item sauvegardé
 * @IsNotEmpty() => Données obligatoire (Erreur si absente)
 * @Allow() => Données facultatives
 * Aucun Decorateur => Données non attendue mais complétées ultérieurement
 */

export class CreateSousitemsaveDto {
    
    @IsNotEmpty()
    idSousItem : string;
    
    @IsNotEmpty()
    libelleSousItem: string;
    
    @IsNotEmpty()
    idItem: string;
    
    @IsNotEmpty()
    codeSousItem: string;
    
    @IsNotEmpty()
    securite : boolean;
    
    @IsNotEmpty()
    estPrefixe: boolean;
    
    @IsNotEmpty()
    etat: string;
    
    @IsNotEmpty()
    date : Date
    
    @Allow()
    description: Description[];

    @IsNotEmpty()
    status: string;

    @Allow()
    profilModification : string;

    @Allow()
    posteModification : string;

}
