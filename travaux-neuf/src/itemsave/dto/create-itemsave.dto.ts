import { Allow, IsNotEmpty } from "class-validator";
import { Description } from "src/description/entities/description.entity";

/**
 * Structure de données attendue pour la création d'un item sauvegardé
 * @IsNotEmpty() => Données obligatoire (Erreur si absente)
 * @Allow() => Données facultatives
 * Aucun Decorateur => Données non attendue mais complétées ultérieurement
 */

export class CreateItemsaveDto {

    @IsNotEmpty()
    idItem : string;
    
    @IsNotEmpty()
    libelleItem : string;
    
    @IsNotEmpty()
    idOR : string;
    
    @IsNotEmpty()
    numeroUnique : string;
    
    @IsNotEmpty()
    digit : number;
    
    @IsNotEmpty()
    codeObjet : string;
    
    @IsNotEmpty()
    securite : boolean;
   
    @IsNotEmpty()
    etat : string
  
    @IsNotEmpty()
    date : Date
      
    @IsNotEmpty()
    description : Description[];

    @IsNotEmpty()
    status : string;

    @IsNotEmpty()
    profilModification : string;

    @Allow()
    posteModification : string;
    
}
