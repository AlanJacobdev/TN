import { IsNotEmpty } from "class-validator";

export class CreateExportationDto {

    @IsNotEmpty()
    nomDocument : string;

    @IsNotEmpty()
    path : string

    @IsNotEmpty()
    date : Date

    @IsNotEmpty()
    profil : string
    
}
