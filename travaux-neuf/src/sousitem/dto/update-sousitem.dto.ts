import { PartialType } from '@nestjs/mapped-types';
import { CreateSousitemDto } from './create-sousitem.dto';

export class UpdateSousitemDto extends PartialType(CreateSousitemDto) {}
