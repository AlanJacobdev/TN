import { PartialType } from '@nestjs/mapped-types';
import { CreateDescriptionDto } from './create-description.dto';


/**
 * Structure de données attendue pour la modification d'une description : étends la création = même champs et même décorateur
 * @IsNotEmpty() => Données obligatoire (Erreur si absente)
 * @Allow() => Données facultatives
 * Aucun Decorateur => Données non attendue mais complétées ultérieurement
 */

export class UpdateDescriptionDto extends PartialType(CreateDescriptionDto) {}
