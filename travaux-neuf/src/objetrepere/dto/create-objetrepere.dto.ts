import { IsNotEmpty } from "class-validator";

export class CreateObjetrepereDto {

    @IsNotEmpty()
    idObjetRepere : string;

    @IsNotEmpty()
    libelleObjetRepere : string;

    @IsNotEmpty()
    codeType : string;
    
    @IsNotEmpty()
    numeroUnique : string;

    @IsNotEmpty()
    valide : boolean;

    @IsNotEmpty()
    description : string;

    @IsNotEmpty()
    profilCreation : string;

    posteCreation : string;
    
    dateCreation : Date;


}
