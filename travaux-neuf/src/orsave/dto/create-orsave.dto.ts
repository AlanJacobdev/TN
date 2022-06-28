import { Allow, IsNotEmpty } from "class-validator";
import { Description } from "src/description/entities/description.entity";


export class CreateOrsaveDto {
    
    @IsNotEmpty()
    idObjetRepere : string;

    @IsNotEmpty()
    libelleObjetRepere : string;
   
    @IsNotEmpty()
    codeType : string;

    @IsNotEmpty()
    numeroUnique : string;

    @IsNotEmpty()
    etat : string;

    @IsNotEmpty()
    description: Description[];

    @IsNotEmpty()
    status : string;

    @IsNotEmpty()
    date : Date

    @IsNotEmpty()
    profilModification : string;

    @Allow()
    posteModification : string;

}
