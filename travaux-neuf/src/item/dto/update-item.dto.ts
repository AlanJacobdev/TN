import { Allow, isNotEmpty, IsNotEmpty } from "class-validator";

export class UpdateItemDto {

    @IsNotEmpty()
    libelleItem : string

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
