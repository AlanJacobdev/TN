import { IsNotEmpty } from "class-validator";
import { Atelier } from "src/atelier/entities/atelier.entity";

export class CreateNumerouniqueDto {

    @IsNotEmpty()
    idNumeroUnique : string;

    @IsNotEmpty()
    idAtelier : string;
    
    @IsNotEmpty()
    numeroObjet : number


}
