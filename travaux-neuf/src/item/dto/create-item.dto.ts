import { IsNotEmpty } from "class-validator";
import { Objetrepere } from "src/objetrepere/entities/objetrepere.entity";
import { Typeobjet } from "src/typeobjet/entities/typeobjet.entity";

export class CreateItemDto {
   
    @IsNotEmpty()
    idItem : string;

    @IsNotEmpty()
    libelleItem : string

    @IsNotEmpty()
    idOR : Objetrepere;

    @IsNotEmpty()
    numeroUnique : string;

    @IsNotEmpty()
    digit : number;

    @IsNotEmpty()
    codeObjet : Typeobjet;

    @IsNotEmpty()
    securite : boolean;

    @IsNotEmpty()
    actif : boolean;

    @IsNotEmpty()
    dateCreation : Date;

    @IsNotEmpty()
    profilCreation : string;

    @IsNotEmpty()
    description : string;

}
