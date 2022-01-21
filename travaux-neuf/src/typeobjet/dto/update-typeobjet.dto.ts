import { PartialType } from '@nestjs/mapped-types';
import { CreateTypeobjetDto } from './create-typeobjet.dto';

export class UpdateTypeobjetDto extends PartialType(CreateTypeobjetDto) {}
