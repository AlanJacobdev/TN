import { IsNotEmpty } from "class-validator";
import { Objetrepere } from "src/objetrepere/entities/objetrepere.entity";

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
    etat : boolean;

    @IsNotEmpty()
    date : Date

    @IsNotEmpty()
    heure : Date;

}
