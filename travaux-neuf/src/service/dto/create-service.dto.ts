import { IsNotEmpty } from "class-validator";

export class CreateServiceDto {
    @IsNotEmpty()
    idService : string;

    @IsNotEmpty()
    libelleService : string;
   
    @IsNotEmpty()
    profilCreation : string;
    
    posteCreation : string;

    dateCreation : Date;

   
}
