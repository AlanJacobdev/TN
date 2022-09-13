import { Allow, IsNotEmpty } from "class-validator";

/*
* Structure de données attendue pour la modification d'un Paramètre
* @IsNotEmpty() => Données obligatoire (Erreur si absente)
* @Allow() => Données facultatives
* Aucun Decorateur => Données non attendue mais complétées ultérieurement
*/

export class UpdateParametreDto  {

    @IsNotEmpty()
    valeur : string
    
    @IsNotEmpty()
    profilModification : string;

    @Allow()
    posteModification : string;
    
    dateModification : Date;

}
