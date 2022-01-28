import { IsNotEmpty } from 'class-validator';

export class UpdateServiceDto {

    @IsNotEmpty()
    idService : string;

    @IsNotEmpty()
    libelleService : string;

    @IsNotEmpty()
    profilModification : string;
 
    posteModification : string;

    dateModification : Date;


}
