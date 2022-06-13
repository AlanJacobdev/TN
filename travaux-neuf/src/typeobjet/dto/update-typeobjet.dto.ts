import { Allow, IsNotEmpty } from 'class-validator';

export class UpdateTypeobjetDto  {


    @Allow()
    libelleType : string;

    @IsNotEmpty()
    profilModification : string;
    
    @IsNotEmpty()
    actif : boolean;
    
    @Allow()
    posteModification : string;

    dateModification : Date;
}
