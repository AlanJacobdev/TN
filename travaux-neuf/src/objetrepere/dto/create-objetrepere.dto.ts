import { Allow, IsNotEmpty } from "class-validator";

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

    @Allow()
    description : string;

    @IsNotEmpty()
    profilCreation : string;
    
    @Allow()
    posteCreation : string;
    
    dateCreation : Date;


}
