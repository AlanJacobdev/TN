import { PartialType } from '@nestjs/mapped-types';
import { CreateObjetrepereDto } from './create-objetrepere.dto';

export class UpdateObjetrepereDto extends PartialType(CreateObjetrepereDto) {}
