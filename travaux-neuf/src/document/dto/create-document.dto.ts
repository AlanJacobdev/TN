import { IsNotEmpty } from "class-validator"

export class CreateDocumentDto {

    @IsNotEmpty()
    idDocument : string
    
    @IsNotEmpty()
    nomDocument : string

    @IsNotEmpty()
    path : string

    @IsNotEmpty()
    date : Date

    @IsNotEmpty()
    profil : string
}
