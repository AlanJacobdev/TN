import { Allow, isEmpty, IsNotEmpty } from 'class-validator';

export class UpdateDroitDto {


    @IsNotEmpty()
    libelleDroit : string;

    @IsNotEmpty()
    profilModification : string;

    @Allow()
    posteModification : string;
    
    dateModification : Date;

}


