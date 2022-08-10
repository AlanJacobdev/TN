import { PartialType } from '@nestjs/mapped-types';
import { CreateExportationDto } from './create-exportation.dto';

export class UpdateExportationDto extends PartialType(CreateExportationDto) {
    
}
