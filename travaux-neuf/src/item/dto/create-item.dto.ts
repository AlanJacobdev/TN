import { Allow, IsInt, IsNotEmpty } from "class-validator";
import { Description } from "src/description/entities/description.entity";

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
    etat : string;

    @Allow()
    description : Description[];
    
    @IsNotEmpty()
    profilCreation : string;

    dateCreation : Date;

    @Allow()
    posteCreation : string;

}
