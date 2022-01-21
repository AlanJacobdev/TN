import { IsNotEmpty } from "class-validator";

export class CreateSousitemDto {

    @IsNotEmpty()
    idSousItem : string;

    @IsNotEmpty()
    libelleSousItem : string;

    @IsNotEmpty()
    idItem : string;

    @IsNotEmpty()
    codeSousItem : string;

    @IsNotEmpty()
    securite : boolean;

    @IsNotEmpty()
    estPrefixe : boolean;

    @IsNotEmpty()
    actif : boolean;

    @IsNotEmpty()
    dateCreation : Date;

    @IsNotEmpty()
    profilCreation : string;

    @IsNotEmpty()
    description : string;

}
