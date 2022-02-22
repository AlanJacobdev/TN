import { Allow, IsNotEmpty } from 'class-validator';

export class UpdateTypeobjetrepereDto {

    @IsNotEmpty()
    libelleTypeOR : string;

    @IsNotEmpty()
    profilModification : string;

    @Allow()
    posteModification : string;

    dateModification : Date;
}
