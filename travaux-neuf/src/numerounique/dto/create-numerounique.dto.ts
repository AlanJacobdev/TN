import { Allow, IsNotEmpty } from "class-validator";
import { Atelier } from "src/atelier/entities/atelier.entity";


export class CreateNumerouniqueDto {

    @IsNotEmpty()
    idNumeroUnique : string;

    @IsNotEmpty()
    idAtelier : Atelier;
    
    @IsNotEmpty()
    numeroObjet : string

    @IsNotEmpty()
    profilCreation : string;

    @Allow()
    posteCreation : string;
    
    dateCreation : Date;
    
}
