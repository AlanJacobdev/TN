import { IsNotEmpty } from 'class-validator';
import { Atelier } from 'src/atelier/entities/atelier.entity';

export class UpdateNumerouniqueDto {
    @IsNotEmpty()
    idNumeroUnique : string;

    @IsNotEmpty()
    idAtelier : Atelier;
    
    @IsNotEmpty()
    numeroObjet : string

    @IsNotEmpty()
    profilModification : string;

    posteModification : string;
    
    dateModification : Date;
    
}
