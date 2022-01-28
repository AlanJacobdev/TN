import { IsNotEmpty } from 'class-validator';

export class UpdateSousitemDto {

    @IsNotEmpty()
    idSousItem : string;

    @IsNotEmpty()
    libelleSousItem : string;

    @IsNotEmpty()
    idItem : string;

    @IsNotEmpty()
    codeSousItem : string;

    @IsNotEmpty()
    securite : boolean;

    @IsNotEmpty()
    estPrefixe : boolean;

    @IsNotEmpty()
    actif : boolean;

    @IsNotEmpty()
    description : string;
    
    @IsNotEmpty()
    profilModification : string;

    posteModification : string; 

    dateModification : Date;
    
}
