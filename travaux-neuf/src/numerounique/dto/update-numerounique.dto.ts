import { Allow, IsNotEmpty } from 'class-validator';
import { Atelier } from 'src/atelier/entities/atelier.entity';

export class UpdateNumerouniqueDto {
    
    @IsNotEmpty()
    numeroObjet : string

    @IsNotEmpty()
    profilModification : string;

    @Allow()
    posteModification : string;
    
    dateModification : Date;
    
}
