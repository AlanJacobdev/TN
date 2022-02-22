import { Allow, IsNotEmpty } from "class-validator";


export class UpdateDroitparutilisateurDto {

   @IsNotEmpty()
    valeur : boolean;
    
    @IsNotEmpty()
    profilModification : string;

    @Allow()
    posteModification : string;
    
    dateModification : Date;
}
