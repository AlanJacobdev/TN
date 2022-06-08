import { Allow, IsNotEmpty } from "class-validator";

export class CreateTypeobjetrepereDto {

    @IsNotEmpty()
    idTypeOR : string;

    @IsNotEmpty()
    libelleTypeOR : string;
   
    @IsNotEmpty()
    profilCreation : string;

    @IsNotEmpty()
    actif : boolean;

    @Allow()
    posteCreation : string;

    dateCreation : Date;

}