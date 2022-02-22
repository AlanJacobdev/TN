import { Allow, IsNotEmpty } from "class-validator";


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
    profilModification : string;

    @Allow()
    posteModification : string;

}
