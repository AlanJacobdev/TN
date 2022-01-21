import { PartialType } from '@nestjs/mapped-types';
import { CreateOrsaveDto } from './create-orsave.dto';

export class UpdateOrsaveDto extends PartialType(CreateOrsaveDto) {}
