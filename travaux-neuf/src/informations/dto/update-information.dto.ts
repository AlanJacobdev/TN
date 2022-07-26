import { IsNotEmpty, Allow } from 'class-validator';

export class UpdateInformationDto {

    @IsNotEmpty()
    text : string

    @Allow()
    document : Document[];

    @Allow()
    idDocument : number[];

    @IsNotEmpty()
    profilModification : string

    dateModification : Date
}
