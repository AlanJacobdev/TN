import { Allow, IsNotEmpty } from "class-validator";

export class CreateTypeobjetrepereDto {

    @IsNotEmpty()
    idTypeOR : string;

    @IsNotEmpty()
    libelleTypeOR : string;
   
    @IsNotEmpty()
    profilCreation : string;

    @Allow()
    posteCreation : string;

    dateCreation : Date;

}