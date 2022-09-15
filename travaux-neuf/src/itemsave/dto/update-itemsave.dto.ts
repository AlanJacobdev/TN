import { PartialType } from '@nestjs/mapped-types';
import { CreateItemsaveDto } from './create-itemsave.dto';

/**
 * Structure de données attendue pour la modification d'un Item
 * @IsNotEmpty() => Données obligatoire (Erreur si absente)
 * @Allow() => Données facultatives
 * Aucun Decorateur => Données non attendue mais complétées ultérieurement
 */
export class UpdateItemsaveDto extends PartialType(CreateItemsaveDto) {}
