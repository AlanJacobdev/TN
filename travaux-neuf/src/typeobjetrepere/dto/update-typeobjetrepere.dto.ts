import { Allow, IsNotEmpty } from 'class-validator';

export class UpdateTypeobjetrepereDto {

    @IsNotEmpty()
    libelleTypeOR : string;

    @IsNotEmpty()
    profilModification : string;

    @IsNotEmpty()
    actif : boolean;
    
    @Allow()
    posteModification : string;

    dateModification : Date;
}
