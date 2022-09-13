import { Allow, IsNotEmpty } from 'class-validator';


/*
* Structure de données attendue pour la modification d'un Type d'objet 
* @IsNotEmpty() => Données obligatoire (Erreur si absente)
* @Allow() => Données facultatives
* Aucun Decorateur => Données non attendue mais complétées ultérieurement
*/

export class UpdateTypeobjetDto  {


    @Allow()
    libelleType : string;

    @IsNotEmpty()
    profilModification : string;
    
    @IsNotEmpty()
    actif : boolean;
    
    @Allow()
    posteModification : string;

    dateModification : Date;
}
