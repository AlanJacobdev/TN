import { Allow, IsNotEmpty } from 'class-validator';
import { Description } from 'src/description/entities/description.entity';

export class UpdateSousitemDto {

    @IsNotEmpty()
    libelleSousItem : string;


    @IsNotEmpty()
    estPrefixe : boolean;

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
