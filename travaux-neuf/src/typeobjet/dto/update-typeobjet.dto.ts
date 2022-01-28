import { IsNotEmpty } from 'class-validator';

export class UpdateTypeobjetDto  {

    @IsNotEmpty()
    idType : string;

    @IsNotEmpty()
    libelleType : string;

    @IsNotEmpty()
    profilModification : string;
    
    posteModification : string;

    dateModification : Date;
}
