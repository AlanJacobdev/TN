import { IsNotEmpty } from "class-validator";


export class UpdateObjetrepereDto {

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
    profilModification : string;

    posteModification : string;
    
    dateModification : Date;

}
