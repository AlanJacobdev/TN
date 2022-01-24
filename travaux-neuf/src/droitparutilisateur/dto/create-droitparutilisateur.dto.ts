import { IsNotEmpty } from "class-validator";

export class CreateDroitparutilisateurDto {

    @IsNotEmpty()
    idUtilisateur : number;

    @IsNotEmpty()
    idDroit : string;

    @IsNotEmpty()
    valeur : boolean;

}
