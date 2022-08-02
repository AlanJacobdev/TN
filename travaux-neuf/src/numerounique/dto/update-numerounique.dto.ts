import { Allow, IsNotEmpty } from 'class-validator';
import { Atelier } from 'src/atelier/entities/atelier.entity';

/**
 * Structure de données attendue pour la modification d'un numéro unique
 * @IsNotEmpty() => Données obligatoire (Erreur si absente)
 * @Allow() => Données facultatives
 * Aucun Decorateur => Données non attendue mais complétées ultérieurement
 */

export class UpdateNumerouniqueDto {
    
    @IsNotEmpty()
    numeroObjet : string

    @IsNotEmpty()
    profilModification : string;

    @Allow()
    posteModification : string;
    
    dateModification : Date;
    
}
