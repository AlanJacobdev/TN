import { Allow, IsNotEmpty } from "class-validator";
import { Description } from "src/description/entities/description.entity";


export class UpdateObjetrepereDto {

  
    @IsNotEmpty()
    libelleObjetRepere : string;

    @IsNotEmpty()
    valide : boolean;

    @Allow()
    description : Description[];

    @IsNotEmpty()
    profilModification : string;
    
    @Allow()
    posteModification : string;
    
    dateModification : Date;

}
