import { Allow, IsNotEmpty } from "class-validator";

export class CreateTypeobjetDto {

    @IsNotEmpty()
    idType : string;

    @IsNotEmpty()
    libelleType : string;
   
    @IsNotEmpty()
    actif : boolean;
    
    @IsNotEmpty()
    profilCreation : string;

    @Allow()
    posteCreation : string;

    dateCreation : Date;

    
    
}
