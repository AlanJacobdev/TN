import { IsNotEmpty } from 'class-validator';

export class UpdateAtelierDto {

        @IsNotEmpty()
        idAtelier : string;
    
        @IsNotEmpty()
        libelleAtelier : string;
    
        @IsNotEmpty()
        codeGMAO : string;
       
        @IsNotEmpty()
        profilModification : string;
    
        posteModification : string;
        
        dateModification : Date;
       
    

}
