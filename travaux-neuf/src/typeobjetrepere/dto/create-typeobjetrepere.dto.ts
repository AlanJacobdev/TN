import { IsNotEmpty } from "class-validator";

export class CreateTypeobjetrepereDto {

    @IsNotEmpty()
    idTypeOR : string;

    @IsNotEmpty()
    libelleTypeOR : string;
   
    @IsNotEmpty()
    profilCreation : string;

    posteCreation : string;

    dateCreation : Date;

}