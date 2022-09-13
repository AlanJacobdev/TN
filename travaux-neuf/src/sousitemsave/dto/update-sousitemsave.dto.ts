import { PartialType } from '@nestjs/mapped-types';
import { CreateSousitemsaveDto } from './create-sousitemsave.dto';

/*
* Structure de données attendue pour la modification d'un Sous item sauvegardé
* @IsNotEmpty() => Données obligatoire (Erreur si absente)
* @Allow() => Données facultatives
* Aucun Decorateur => Données non attendue mais complétées ultérieurement
*/

export class UpdateSousitemsaveDto extends PartialType(CreateSousitemsaveDto) {}
