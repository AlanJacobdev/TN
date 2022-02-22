import { Allow, IsNotEmpty } from 'class-validator';

export class UpdateTypeobjetDto  {


    @IsNotEmpty()
    libelleType : string;

    @IsNotEmpty()
    profilModification : string;
    
    @Allow()
    posteModification : string;

    dateModification : Date;
}
