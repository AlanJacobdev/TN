import { Allow, IsInt, IsNotEmpty } from "class-validator";

export class CreateItemDto {
   

    idItem : string;

    @IsNotEmpty()
    libelleItem : string

    @IsNotEmpty()
    idOR : string;

    @IsNotEmpty()
    numeroUnique : string;

    @IsInt({
        "message": "Le digit doit être un nombre"
    })
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
    profilCreation : string;

    dateCreation : Date;

    @Allow()
    posteCreation : string;

}
