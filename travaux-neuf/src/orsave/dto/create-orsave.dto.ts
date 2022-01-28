import { IsNotEmpty } from "class-validator";


export class CreateOrsaveDto {
    
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
    description: string;

    @IsNotEmpty()
    etat : string;

    @IsNotEmpty()
    date : Date

    @IsNotEmpty()
    heure : Date;

    @IsNotEmpty()
    profilModification : string;

    posteModification : string;

}
