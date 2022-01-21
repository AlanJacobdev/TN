import { IsNotEmpty } from "class-validator";
import { Numerounique } from "src/numerounique/entities/numerounique.entity";
import { Typeobjetrepere } from "src/typeobjetrepere/entities/typeobjetrepere.entity";

export class CreateObjetrepereDto {

    @IsNotEmpty()
    idObjetRepere : string;

    @IsNotEmpty()
    libelleObjetRepere : string;

    @IsNotEmpty()
    codeType : Typeobjetrepere;
    
    @IsNotEmpty()
    numeroUnique : Numerounique;

    @IsNotEmpty()
    valide : boolean;

    @IsNotEmpty()
    dateCreation : Date;

    @IsNotEmpty()
    profilCreation : string;

    @IsNotEmpty()
    description : string;

}
