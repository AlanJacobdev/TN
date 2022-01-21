import { PartialType } from '@nestjs/mapped-types';
import { CreateTypeobjetrepereDto } from './create-typeobjetrepere.dto';

export class UpdateTypeobjetrepereDto extends PartialType(CreateTypeobjetrepereDto) {}
