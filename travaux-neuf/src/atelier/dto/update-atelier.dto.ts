import { Allow, IsNotEmpty } from 'class-validator';

export class UpdateAtelierDto {

    @Allow()
    codeGMAO : string;

    @Allow()
    actif : boolean;
    
    @Allow()
    libelleAtelier : string;

    @IsNotEmpty()
    profilModification : string;

    @Allow()
    posteModification : string;

    dateModification : Date;
       
}
