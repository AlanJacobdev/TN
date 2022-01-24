import { IsNotEmpty } from "class-validator";

export class CreateItemDto {
   
    @IsNotEmpty()
    idItem : string;

    @IsNotEmpty()
    libelleItem : string

    @IsNotEmpty()
    idOR : string;

    @IsNotEmpty()
    numeroUnique : string;

    @IsNotEmpty()
    digit : number;

    @IsNotEmpty()
    codeObjet : string;

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
