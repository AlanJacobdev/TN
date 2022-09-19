import { PartialType } from '@nestjs/mapped-types';
import { CreateOrsaveDto } from './create-orsave.dto';

/**
 * Structure de données attendue pour la modification d'un objet repère sauvegardé
 * @IsNotEmpty() => Données obligatoire (Erreur si absente)
 * @Allow() => Données facultatives
 * Aucun Decorateur => Données non attendue mais complétées ultérieurement
 */

export class UpdateOrsaveDto extends PartialType(CreateOrsaveDto) {}
