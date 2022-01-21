import { PartialType } from '@nestjs/mapped-types';
import { CreateSousitemsaveDto } from './create-sousitemsave.dto';

export class UpdateSousitemsaveDto extends PartialType(CreateSousitemsaveDto) {}
