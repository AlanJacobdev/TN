import { Allow, IsNotEmpty } from 'class-validator';

export class UpdateAtelierDto {

    @Allow()
    codeGMAO : string;

    @IsNotEmpty()
    actif : boolean;
    
    @IsNotEmpty()
    profilModification : string;

    @Allow()
    posteModification : string;

    dateModification : Date;
       
}
