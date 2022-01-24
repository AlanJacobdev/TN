import { PartialType } from '@nestjs/mapped-types';
import { CreateDroitparserviceDto } from './create-droitparservice.dto';

export class UpdateDroitparserviceDto extends PartialType(CreateDroitparserviceDto) {}
