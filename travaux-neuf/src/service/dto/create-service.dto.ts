import { Allow, IsNotEmpty } from "class-validator";

export class CreateServiceDto {
    @IsNotEmpty()
    idService : string;

    @IsNotEmpty()
    libelleService : string;
   
    @IsNotEmpty()
    profilCreation : string;
    
    @Allow()
    posteCreation : string;

    dateCreation : Date;

   
}
