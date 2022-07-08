import { Allow, IsNotEmpty } from "class-validator";

export class UpdateParametreDto  {

    @IsNotEmpty()
    valeur : string
    
    @IsNotEmpty()
    profilModification : string;

    @Allow()
    posteModification : string;
    
    dateModification : Date;

}
