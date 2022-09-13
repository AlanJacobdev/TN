import { PartialType } from '@nestjs/mapped-types';
import { CreateExportationDto } from './create-exportation.dto';

/*
* Structure de données attendue pour la modification d'une exportation
* @IsNotEmpty() => Données obligatoire (Erreur si absente)
* @Allow() => Données facultatives
* Aucun Decorateur => Données non attendue mais complétées ultérieurement
*/

export class UpdateExportationDto extends PartialType(CreateExportationDto) {
    
}
