import { Allow, IsNotEmpty } from "class-validator";

export class CreateTypeobjetDto {

    @IsNotEmpty()
    idType : string;

    @IsNotEmpty()
    libelleType : string;
   
    @IsNotEmpty()
    profilCreation : string;

    @Allow()
    posteCreation : string;

    dateCreation : Date;

    
    
}
