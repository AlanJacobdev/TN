import { Allow, IsNotEmpty, MaxLength } from "class-validator";
import { Description } from "src/description/entities/description.entity";

export class CreateObjetrepereDto {

   
    idObjetRepere : string;

    @MaxLength(50, {
        message: 'Libellé trop long (50 caractères)',
    })
    @IsNotEmpty()
    libelleObjetRepere : string;

    @MaxLength(2, {
        message: 'Code Type trop long (2 caractères)',
    })
    @IsNotEmpty()
    codeType : string;
    
    @MaxLength(4, {
        message: 'Numéro unique trop long (4 caractères)',
    })
    @IsNotEmpty()
    numeroUnique : string;

    @IsNotEmpty()
    valide : boolean;

    @Allow()
    description : Description[];

    @IsNotEmpty()
    profilCreation : string;
    
    @Allow()
    posteCreation : string;
    
    dateCreation : Date;

    @Allow()
    rangeNu : string[]

}
