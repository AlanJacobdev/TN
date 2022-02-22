import { Allow, isNotEmpty, IsNotEmpty } from "class-validator";

export class UpdateItemDto {

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

    @Allow()
    description : string;
    
    @IsNotEmpty()
    profilModification : string;
    
    dateModification : Date;

    @Allow()
    posteModification : string;

}
