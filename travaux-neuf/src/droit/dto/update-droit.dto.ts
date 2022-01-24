import { PartialType } from '@nestjs/mapped-types';
import { CreateDroitDto } from './create-droit.dto';

export class UpdateDroitDto extends PartialType(CreateDroitDto) {}
