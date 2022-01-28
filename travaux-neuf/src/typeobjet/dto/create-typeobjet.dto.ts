import { IsNotEmpty } from "class-validator";

export class CreateTypeobjetDto {

    @IsNotEmpty()
    idType : string;

    @IsNotEmpty()
    libelleType : string;
   
    @IsNotEmpty()
    profilCreation : string;

    posteCreation : string;

    dateCreation : Date;

    
    
}
