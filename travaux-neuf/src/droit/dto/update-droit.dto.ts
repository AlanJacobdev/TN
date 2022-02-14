import { isEmpty, IsNotEmpty } from 'class-validator';

export class UpdateDroitDto {


    @IsNotEmpty()
    libelleDroit : string;

    @IsNotEmpty()
    profilModification : string;

    @IsNotEmpty()
    posteModification : string;
    
    dateModification : Date;
    
    idDroit: string;
}


