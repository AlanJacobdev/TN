import { PartialType } from '@nestjs/mapped-types';
import { Allow, IsNotEmpty } from 'class-validator';
import { Item } from 'src/item/entities/item.entity';
import { Objetrepere } from 'src/objetrepere/entities/objetrepere.entity';
import { Sousitem } from 'src/sousitem/entities/sousitem.entity';
import { CreateDemandeAdminDto } from './create-demande-admin.dto';

export class UpdateDemandeAdminDto {

    etat : boolean;

    @IsNotEmpty()
    isDelete : boolean;

    @IsNotEmpty()
    profilModification : string;

    dateModification : Date;
}
