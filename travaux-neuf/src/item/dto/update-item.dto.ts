import { isNotEmpty, IsNotEmpty } from "class-validator";

export class UpdateItemDto {

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
    description : string;
    
    @IsNotEmpty()
    profilModification : string;
    
    dateModification : Date;

    posteModification : string;

}
