import { Allow, IsNotEmpty } from 'class-validator';

export class UpdateAtelierDto {

 
        @IsNotEmpty()
        codeGMAO : string;

        @IsNotEmpty()
        profilModification : string;

        @Allow()
        posteModification : string;

        dateModification : Date;
       
    

}
