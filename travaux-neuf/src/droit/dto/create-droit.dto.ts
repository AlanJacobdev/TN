import { IsNotEmpty } from "class-validator";

export class CreateDroitDto {

    @IsNotEmpty()
    idDroit : string;

    @IsNotEmpty()
    libelleDroit : string;

}
