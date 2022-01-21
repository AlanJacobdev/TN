import { PartialType } from '@nestjs/mapped-types';
import { CreateAtelierDto } from './create-atelier.dto';

export class UpdateAtelierDto extends PartialType(CreateAtelierDto) {}
