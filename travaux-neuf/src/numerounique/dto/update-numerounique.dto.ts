import { PartialType } from '@nestjs/mapped-types';
import { CreateNumerouniqueDto } from './create-numerounique.dto';

export class UpdateNumerouniqueDto extends PartialType(CreateNumerouniqueDto) {}
