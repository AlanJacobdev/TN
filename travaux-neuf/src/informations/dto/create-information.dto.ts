import { Allow, isNotEmpty, IsNotEmpty } from "class-validator"
import { Document } from "src/document/entities/document.entity";

export class CreateInformationDto {

    idInfo : number
    
    @IsNotEmpty()
    titre : string

    @IsNotEmpty()
    text : string

    @Allow()
    document : Document[];

    @Allow()
    idDocument : number[];
    
    @IsNotEmpty()
    profilCreation : string

    dateCreation : Date
    
}
