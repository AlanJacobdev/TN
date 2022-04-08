import { Allow, IsNotEmpty } from "class-validator";


export class UpdateObjetrepereDto {

  
    @IsNotEmpty()
    libelleObjetRepere : string;

    @IsNotEmpty()
    valide : boolean;

    @Allow()
    description : string;

    @IsNotEmpty()
    profilModification : string;
    
    @Allow()
    posteModification : string;
    
    dateModification : Date;

}
