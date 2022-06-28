import { Allow, IsNotEmpty } from "class-validator";
import { Description } from "src/description/entities/description.entity";


export class UpdateObjetrepereDto {

  
    @IsNotEmpty()
    libelleObjetRepere : string;

    @IsNotEmpty()
    etat : string;

    @Allow()
    description : Description[];

    @IsNotEmpty()
    profilModification : string;
    
    @Allow()
    posteModification : string;
    
    dateModification : Date;

}
