import { Allow, IsNotEmpty } from "class-validator";


export class CreateAtelierDto {
    @IsNotEmpty()
    idAtelier : string;

    @IsNotEmpty()
    libelleAtelier : string;

    @IsNotEmpty()
    codeGMAO : string;
   
    @IsNotEmpty()
    profilCreation : string;

    @Allow()
    posteCreation : string;
    
    dateCreation : Date;
   
}
