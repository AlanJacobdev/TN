import { PartialType } from '@nestjs/mapped-types';
import { CreateDroitparutilisateurDto } from './create-droitparutilisateur.dto';

export class UpdateDroitparutilisateurDto extends PartialType(CreateDroitparutilisateurDto) {}
