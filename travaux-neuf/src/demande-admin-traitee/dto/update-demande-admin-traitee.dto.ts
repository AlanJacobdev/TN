import { PartialType } from '@nestjs/mapped-types';
import { CreateDemandeAdminTraiteeDto } from './create-demande-admin-traitee.dto';

export class UpdateDemandeAdminTraiteeDto extends PartialType(CreateDemandeAdminTraiteeDto) {}
