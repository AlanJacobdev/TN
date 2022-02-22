import { Allow, IsNotEmpty } from 'class-validator';

export class UpdateServiceDto {

    @IsNotEmpty()
    idService : string;

    @IsNotEmpty()
    libelleService : string;

    @IsNotEmpty()
    profilModification : string;
 
    @Allow()
    posteModification : string;

    dateModification : Date;


}
