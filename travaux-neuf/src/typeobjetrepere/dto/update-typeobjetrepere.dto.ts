import { IsNotEmpty } from 'class-validator';

export class UpdateTypeobjetrepereDto {

    @IsNotEmpty()
    idTypeOR : string;

    @IsNotEmpty()
    libelleTypeOR : string;

    @IsNotEmpty()
    profilModification : string;

    posteModification : string;

    dateModification : Date;
}
