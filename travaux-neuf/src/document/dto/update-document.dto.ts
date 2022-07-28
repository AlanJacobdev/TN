import { IsNotEmpty } from "class-validator"
export class UpdateDocumentDto {

    @IsNotEmpty()
    idDocument : number
    
    @IsNotEmpty()
    libelleDocument : string

}
