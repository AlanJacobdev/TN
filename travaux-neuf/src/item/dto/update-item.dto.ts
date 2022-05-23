import { Allow, isNotEmpty, IsNotEmpty } from "class-validator";
import { Description } from "src/description/entities/description.entity";

export class UpdateItemDto {

    @IsNotEmpty()
    libelleItem : string

    @IsNotEmpty()
    etat : string;

    @Allow()
    description : Description[];
    
    @IsNotEmpty()
    profilModification : string;
    
    dateModification : Date;

    @Allow()
    posteModification : string;

}
