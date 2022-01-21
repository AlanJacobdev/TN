import { PartialType } from '@nestjs/mapped-types';
import { CreateItemsaveDto } from './create-itemsave.dto';

export class UpdateItemsaveDto extends PartialType(CreateItemsaveDto) {}
