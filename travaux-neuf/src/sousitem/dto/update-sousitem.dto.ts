import { Allow, IsNotEmpty } from 'class-validator';

export class UpdateSousitemDto {

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

    @Allow()
    description : string;
    
    @IsNotEmpty()
    profilModification : string;

    @Allow()
    posteModification : string; 

    dateModification : Date;
    
}
